const NanoBananaClient = require("./nanoBananaClient")

class VerificationAiCommunication {
    /**
     * @param {string} input
     */
    buildPrompt(input) {
        return `Você é um agente especializado em verificação de veracidade de informações.

Analise o conteúdo abaixo e determine o quanto ele é verdadeiro com base em fatos verificáveis, fontes confiáveis e conhecimento consolidado.

Conteúdo: ${input}

Retorne apenas um objeto JSON válido, sem texto adicional, sem markdown, seguindo exatamente esta estrutura:

{
    "percentage": 85,
    "justification": "justificativa detalhada aqui"
}

Onde:
- "percentage" é um número inteiro de 0 a 100 representando o percentual de veracidade
- "justification" é uma explicação clara e objetiva do porquê dessa porcentagem`
    }

    /**
     * @param {string} input
     */
    async verify(input) {
        const prompt = this.buildPrompt(input)
        const response = await NanoBananaClient.generateContent(prompt)

        if (response?.error) return response

        try {
            const clean = response.replace(/```json|```/g, "").trim()
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
}

module.exports = new VerificationAiCommunication()