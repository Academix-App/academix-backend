const axios = require("axios")
const pdfParse = require("pdf-parse")

const NanoBananaClient = new (require("./nanoBananaClient"))()

const URL_REGEX = /^https?:\/\/.+/i

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
        try {
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                },
                timeout: 8000
            })

            return response.data
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 12000)
        } catch (error) {
            console.log("Erro ao extrair URL:", error.message)

            throw new Error("Falha ao acessar a URL informada.")
        }
    }

    /**
     * @param {Buffer} pdfBuffer
     * @returns {Promise<string>}
     */
    async #extractTextFromPdf(pdfBuffer) {
        try {
            const data = await pdfParse(pdfBuffer)

            return data.text
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 15000)
        } catch (error) {
            console.log("Erro ao ler PDF:", error.message)

            throw new Error("Falha ao extrair texto do documento PDF.")
        }
    }

    /**
     * @param {string} rawResponse
     */
    #parseAiResponse(rawResponse) {
        try {
            const clean = rawResponse
                .replace(/```json|```/g, "")
                .trim()

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
     * @param {string} [input]
     * @param {Buffer} [pdfBuffer]
     */
    async verify(input, pdfBuffer) {
        let aiResponse

        try {
            if (pdfBuffer) {
                const pdfText = await this.#extractTextFromPdf(pdfBuffer)

                const prompt = this.buildPrompt(pdfText)

                aiResponse = await NanoBananaClient.generateContent(prompt)
            } else if (URL_REGEX.test(input)) {
                const pageText = await this.#extractTextFromUrl(input)

                const prompt = this.buildPrompt(pageText)

                aiResponse = await NanoBananaClient.generateContent(prompt)
            } else {
                const prompt = this.buildPrompt(input)

                aiResponse = await NanoBananaClient.generateContent(prompt)
            }
        } catch (error) {
            return {
                error: true,
                message: error.message,
                id: "verification_error"
            }
        }

        if (aiResponse?.error) {
            return aiResponse
        }

        return this.#parseAiResponse(aiResponse)
    }
}

module.exports = new VerificationAiCommunication()