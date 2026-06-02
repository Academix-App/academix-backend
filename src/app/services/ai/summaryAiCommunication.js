const NanoBananaClient = require("./NanoBananaClient")

class SummaryAICommunication {
    /**
     * @param {string} content
     */
   async generateSummary(content) {
    const prompt = this.buildPrompt(content)
    const response = await NanoBananaClient.generateContent(prompt)

    if (response?.error) return {
        error: true,
        message: "Não foi possível gerar o resumo.",
        id: "ai_summary_error"
    }

    return this.parseResponse(response)
}

    buildPrompt(content) {
        return `
Você é um assistente acadêmico.

Resuma o texto abaixo de forma clara, objetiva e mantendo os principais pontos.

Texto:
${content}

Responda apenas com o resumo, sem títulos ou explicações adicionais.
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

        return {
            summary: responseText.trim()
        }
    }
}

module.exports = new SummaryAICommunication()