const axios = require("axios")
const NanoBananaClient = new (require("./nanoBananaClient"))()

const URL_REGEX = /^https?:\/\/.+/i

class VerificationAiCommunication {
    /**
     * @param {string} [textContent]
     */
    buildPrompt(textContent) {
        const contentBlock = textContent
            ? `Conteúdo: "${textContent}"`
            : `Conteúdo: [O conteúdo foi enviado como PDF acima. Analise-o diretamente.]`

        return `Você é um perito em jornalismo investigativo e verificação de fatos.
Sua missão é detectar desinformação com alta precisão.

PROCEDIMENTO DE ANÁLISE:
1. LEITURA: Identifique as afirmações principais do conteúdo.
2. CRÍTICA: Questione se a informação parece lógica, se cita fontes datáveis e se o tom é sensacionalista.
3. CETICISMO: Mesmo que a fonte pareça oficial, verifique se não há contradições internas no texto.
4. VEREDITO: Se houver qualquer dúvida sobre a veracidade, a nota deve ser penalizada.

${contentBlock}

Retorne APENAS um JSON:
{
    "percentage": [0-100],
    "justification": "Explicação detalhada contendo: 1. A análise dos pontos principais; 2. Avaliação da credibilidade das fontes citadas; 3. Veredito final sobre a veracidade."
}`
    }

    /**
     * @param {string} url
     * @returns {Promise<string>}
     */
    async #extractTextFromUrl(url) {
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 8000,
            responseType: "text"
        })

        const html = typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data)

        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 12000)
    }

    /**
     * @param {string} rawResponse
     */
    #parseAiResponse(rawResponse) {
        try {
            const clean = rawResponse.replace(/```json|```/g, "").trim()
            return JSON.parse(clean)
        } catch (error) {
            console.log(error)
            return {
                error: true,
                message: "Erro ao processar resposta da IA.",
                id: "ai_parse_error"
            }
        }
    }

    /**
     * @param {string} [input]          - texto livre ou URL
     * @param {Buffer}  [pdfBuffer]     - buffer do PDF enviado via upload
     */
    async verify(input, pdfBuffer) {
        let aiResponse

        if (pdfBuffer) {
            const pdfBase64 = pdfBuffer.toString("base64")
            const prompt = this.buildPrompt()
            aiResponse = await NanoBananaClient.generateContentWithPdf(prompt, pdfBase64)
        } else if (URL_REGEX.test(input)) {
            const pageText = await this.#extractTextFromUrl(input)
            const prompt = this.buildPrompt(pageText)
            aiResponse = await NanoBananaClient.generateContent(prompt)
        } else {
            const prompt = this.buildPrompt(input)
            aiResponse = await NanoBananaClient.generateContent(prompt)
        }

        if (aiResponse?.error) return aiResponse

        return this.#parseAiResponse(aiResponse)
    }
}

module.exports = new VerificationAiCommunication()