const NanoBananaClient = require("./nanoBananaClient")

class SummaryAiCommunication {
    /**
     * @param {string} content
     */
    buildPrompt(content) {
        return `Você está integrado a um sistema de aprendizagem chamado Academix que reforça conteúdos estudados com base no Método de Memorização Exponencial Efetivo na Base Binária (MMEEBB).

Preciso que você elabore um resumo claro e objetivo do conteúdo abaixo, com o objetivo de reforçar o aprendizado do estudante.

Conteúdo: ${content}

Obs. 1: O resumo deve ser direto e fácil de entender.
Obs. 2: Sempre que possível, insira exemplos e/ou formas de aplicação.
Obs. 3: Não cite o método utilizado, forneça apenas informações sobre o conteúdo.
Obs. 4: Sempre informe no início qual conteúdo está sendo reforçado.
Obs. 5: Retorne apenas um objeto JSON válido, sem texto adicional, sem markdown, seguindo exatamente esta estrutura:

{
    "summary": "resumo gerado aqui"
}`
    }

    /**
     * @param {string} content
     */
    async generate(content) {
        const prompt = this.buildPrompt(content)
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

module.exports = new SummaryAiCommunication()