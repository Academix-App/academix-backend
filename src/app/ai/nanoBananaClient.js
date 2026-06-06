const { GoogleGenAI } = require("@google/genai")

class NanoBananaClient {
    constructor() {
        this.client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    /**
     * @param {string} prompt
     */
    async generateContent(prompt) {
        try {
            const response = await this.client.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            })

            return response.text
        } catch (error) {
            console.log("Erro Gemini:", error)

            return {
                error: true,
                message: "Erro ao chamar IA",
                id: "ai_request_error"
            }
        }
    }
}

module.exports = new NanoBananaClient()