const NanoBananaClient = require("./NanoBananaClient")

class VerificationAICommunication {
    /**
     * @param {string} content
     * @param {string} referenceContent
     */
    async verify(content, referenceContent) {
        const prompt = this.buildPrompt(content, referenceContent)

        const response = await NanoBananaClient.generateContent(prompt)

        if (response?.error) return {
            error: true,
            message: "Não foi possível processar a verificação.",
            id: "ai_verification_error"
        }

        return this.parseResponse(response)
    }

    buildPrompt(content, referenceContent) {
        return `
Você é um corretor acadêmico.

Compare o texto do aluno com o conteúdo de referência.

Conteúdo de referência:
${referenceContent}

Texto do aluno:
${content}

Responda SOMENTE neste formato:

Score: (0 a 100)
Feedback: (explicação clara e objetiva)
`
    }

    parseResponse(responseText) {
        if (!responseText) {
            return {
                error: true,
                message: "Resposta inválida da IA",
                id: "invalid_ai_response"
            }
        }

        const scoreMatch = responseText.match(/Score:\s*(\d+)/i)
        const feedbackMatch = responseText.match(/Feedback:\s*([\s\S]*)/i)

        return {
            score: scoreMatch ? Number(scoreMatch[1]) : 0,
            feedback: feedbackMatch ? feedbackMatch[1].trim() : ""
        }
    }
}

module.exports = new VerificationAICommunication()