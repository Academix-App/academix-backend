const NanoBananaClient = new  (require("./nanoBananaClient"))()

class ChatAiCommunication {
    /**
     * @param {string} content        - conteúdo original cadastrado pelo usuário
     * @param {string} summary        - resumo gerado pelo worker
     * @param {{ role: 'user'|'assistant', message: string }[]} history
     * @param {string} newMessage
     */
    buildHistory(content, summary, history, newMessage) {
        const systemTurn = {
            role: "user",
            parts: [{
                text: `Você é um tutor inteligente integrado ao Academix, um sistema de aprendizagem baseado no Método de Memorização Exponencial Efetivo na Base Binária (MMEEBB).

O estudante cadastrou o seguinte conteúdo para estudo:
"${content}"

Você já gerou o seguinte resumo sobre esse conteúdo:
"${summary}"

Seu papel agora é conversar com o estudante para reforçar o aprendizado desse conteúdo específico.
Responda de forma clara, didática e objetiva. Não saia do contexto do conteúdo cadastrado.`
            }]
        }

        const systemAck = {
            role: "model",
            parts: [{ text: "Entendido! Estou pronto para ajudar o estudante a reforçar esse conteúdo." }]
        }

        const historyTurns = history.map((entry) => ({
            role: entry.role === "assistant" ? "model" : "user",
            parts: [{ text: entry.message }]
        }))

        const newTurn = {
            role: "user",
            parts: [{ text: newMessage }]
        }

        return [systemTurn, systemAck, ...historyTurns, newTurn]
    }

    /**
     * @param {string} content
     * @param {string} summary
     * @param {{ role: 'user'|'assistant', message: string }[]} history
     * @param {string} newMessage
     */
    async chat(content, summary, history, newMessage) {
        const turns = this.buildHistory(content, summary, history, newMessage)
        const response = await NanoBananaClient.generateContentWithHistory(turns)

        if (response?.error) return response

        return { message: response.trim() }
    }
}

module.exports = new ChatAiCommunication()