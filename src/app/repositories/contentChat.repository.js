const ContentChats = require("../database/models/contentChat")

class ContentChatRepository {
    /**
     * @param {number} contentId
     * @param {number} accountId
     */
    async findAllByContentId(contentId, accountId) {
        const chats = await ContentChats.findAll({
            where: {
                contentId,
                accountId
            },
            order: [["created_at", "ASC"]]
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!chats) return {
            error: true,
            message: "Não foi possível obter o histórico da conversa.",
            id: "internal_server_error"
        }

        return chats
    }

    /**
     * @param {number} contentId
     * @param {number} accountId
     * @param {'user'|'assistant'} role
     * @param {string} message
     */
    async create(contentId, accountId, role, message) {
        const chat = await ContentChats.create({
            contentId,
            accountId,
            role,
            message,
            createdAt: Date.now()
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!chat) return {
            error: true,
            message: "Não foi possível salvar a mensagem.",
            id: "internal_server_error"
        }

        return chat
    }
}

module.exports = new ContentChatRepository()