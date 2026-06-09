const { GoogleGenAI } = require("@google/genai")

class NanoBananaClient {
    constructor() {
        this.client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    #handleError(error) {
        console.log("Erro Gemini:", error)
        return {
            error: true,
            message: "Erro ao chamar IA",
            id: "ai_request_error"
        }
    }

    /**
     * @param {string} prompt
     */
    async generateContent(prompt) {
        try {
            const response = await this.client.models.generateContent({
                model: "gemini-3.5-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
            return response.text
        } catch (error) {
            return this.#handleError(error)
        }
    }

    /**
     * @param {string} prompt
     * @param {string} pdfBase64
     */
    async generateContentWithPdf(prompt, pdfBase64) {
        try {
            const response = await this.client.models.generateContent({
                model: "gemini-3.5-flash",
                contents: [{
                    role: "user",
                    parts: [
                        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
                        { text: prompt }
                    ]
                }]
            })
            return response.text
        } catch (error) {
            return this.#handleError(error)
        }
    }

    /**
     * @param {{ role: string, parts: { text: string }[] }[]} turns
     */
    async generateContentWithHistory(turns) {
        try {
            const response = await this.client.models.generateContent({
                model: "gemini-3.5-flash",
                contents: turns
            })
            return response.text
        } catch (error) {
            return this.#handleError(error)
        }
    }
}

module.exports = NanoBananaClient