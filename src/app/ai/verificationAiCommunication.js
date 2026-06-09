const axios = require("axios");
const cheerio = require("cheerio");
const pdfParse = require("pdf-parse");

const NanoBananaClient = new (require("./nanoBananaClient"))();

const URL_REGEX = /^https?:\/\/.+/i;

class VerificationAiCommunication {
    /**
     * @param {string} textContent
     */
    buildPrompt(textContent) {
        return `Você é um perito em jornalismo investigativo e verificação de fatos.
Sua missão é detectar desinformação com alta precisão.

PROCEDIMENTO DE ANÁLISE:
1. LEITURA: Identifique as afirmações principais do conteúdo.
2. CRÍTICA: Questione se a informação parece lógica, se cita fontes datáveis e se o tom é sensacionalista.
3. CETICISMO: Mesmo que a fonte pareça oficial, verifique se não há contradições internas no texto.
4. VEREDITO: Se houver qualquer dúvida sobre a veracidade, a nota deve ser penalizada.

Conteúdo: "${textContent}"

Retorne APENAS um JSON estritamente neste formato:
{
    "percentage": [número de 0 a 100 indicando a veracidade],
    "justification": "Sua explicação detalhada."
}`;
    }

    /**
     * @param {string} url
     * @returns {Promise<string>}
     */
    async #extractTextFromUrl(url) {
        try {
            const response = await axios.get(url, {
                headers: { 
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "text/html"
                },
                timeout: 8000
            });
            
            const $ = cheerio.load(response.data);
            $('script, style, noscript').remove();
            
            return $('body').text().replace(/\s+/g, " ").trim().slice(0, 12000);
        } catch (error) {
            console.log("Erro ao extrair URL:", error.message);
            return `Não foi possível acessar a URL diretamente devido a bloqueios do site. O endereço analisado foi: ${url}. Avalie a credibilidade do domínio.`;
        }
    }

    /**
     * @param {Buffer} pdfBuffer
     * @returns {Promise<string>}
     */
    async #extractTextFromPdf(pdfBuffer) {
        try {
            const data = await pdfParse(pdfBuffer);
            return data.text.replace(/\s+/g, " ").trim().slice(0, 15000);
        } catch (error) {
            console.log("Erro ao ler PDF:", error.message);
            throw new Error("Falha ao extrair texto do documento PDF.");
        }
    }

    /**
     * @param {string} rawResponse
     */
    #parseAiResponse(rawResponse) {
        try {
            const clean = rawResponse.replace(/json|/g, "").trim();
            return JSON.parse(clean);
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: "Erro ao processar resposta da IA.",
                id: "ai_parse_error"
            };
        }
    }

    /**
     * @param {string} [input]         - texto livre ou URL
     * @param {Buffer}  [pdfBuffer]     - buffer do PDF enviado via upload
     */
    async verify(input, pdfBuffer) {
        let aiResponse;
        let finalContentToAnalyze = "";

        try {
            if (pdfBuffer) {
                finalContentToAnalyze = await this.#extractTextFromPdf(pdfBuffer);
            } else if (URL_REGEX.test(input)) {
                finalContentToAnalyze = await this.#extractTextFromUrl(input);
            } else {
                finalContentToAnalyze = input;
            }

            const prompt = this.buildPrompt(finalContentToAnalyze);
            aiResponse = await NanoBananaClient.generateContent(prompt);

        } catch (extractionError) {
             return { error: true, message: extractionError.message, id: "extraction_error" };
        }

        if (aiResponse?.error) return aiResponse;
        return this.#parseAiResponse(aiResponse);
    }
}

module.exports = new VerificationAiCommunication();
