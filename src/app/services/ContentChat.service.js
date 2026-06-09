const ContentChatRepository = require("../repositories/contentChat.repository")
const ContentRepository = require("../repositories/content.repository")
const ContentSummaryRepository = require("../repositories/contentSummary.repository")
const ChatAiCommunication = require("../ai/chatAiCommunication")

class ContentChatService {
    /**
     * @param {number} contentId
     * @param {number} accountId
     */
    async findAllMessages(contentId, accountId) {
        const content = await ContentRepository.findById(contentId, accountId)
        if (content?.error) return content

        return await ContentChatRepository.findAllByContentId(contentId, accountId)
    }

    /**
     * @param {number} contentId
     * @param {number} accountId
     * @param {string} message
     */
    async sendMessage(contentId, accountId, message) {
        const content = await ContentRepository.findById(contentId, accountId)
        if (content?.error) return content

        const summaries = await ContentSummaryRepository.findAllByContentId(contentId)
        if (summaries?.error || summaries.length === 0) return {
            error: true,
            message: "Nenhum resumo encontrado para esse conteúdo. Aguarde a geração do resumo antes de iniciar a conversa.",
            id: "summary_not_found"
        }

        const lastSummary = summaries[summaries.length - 1].summary

        const history = await ContentChatRepository.findAllByContentId(contentId, accountId)
        if (history?.error) return history

        const userMessage = await ContentChatRepository.create(contentId, accountId, "user", message)
        if (userMessage?.error) return userMessage

        const result = await ChatAiCommunication.chat(content.content, lastSummary, history, message)
        if (result?.error) return result

        const assistantMessage = await ContentChatRepository.create(contentId, accountId, "assistant", result.message)
        if (assistantMessage?.error) return assistantMessage

        return assistantMessage
    }
}

module.exports = new ContentChatService()