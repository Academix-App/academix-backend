const NanoBananaClient = require("./nanoBananaClient")

class VerificationAiCommunication {
    /**
     * @param {string} input
     */
    buildPrompt(input) {
        return `Você é um perito em jornalismo investigativo e verificação de fatos.
Sua missão é detectar desinformação com alta precisão.

PROCEDIMENTO DE ANÁLISE:
1. LEITURA: Identifique as afirmações principais do conteúdo.
2. CRÍTICA: Questione se a informação parece lógica, se cita fontes datáveis e se o tom é sensacionalista.
3. CETICISMO: Mesmo que a fonte pareça oficial, verifique se não há contradições internas no texto.
4. VEREDITO: Se houver qualquer dúvida sobre a veracidade, a nota deve ser penalizada.

Conteúdo: "${input}"

Retorne APENAS um JSON:
{
    "percentage": [0-100],
    "justification": "Explicação detalhada contendo: 1. A análise dos pontos principais; 2. Avaliação da credibilidade das fontes citadas; 3. Veredito final sobre a veracidade."
}`
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