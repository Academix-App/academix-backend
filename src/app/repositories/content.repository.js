const Contents = require("../database/models/contents")
const ContentSummaries = require("../database/models/contentsSummaries")

class ContentRepository {
    /**
     * @param {number} accountId
     */
    async findAllByAccountId(accountId) {
        const contents = await Contents.findAll({
            where: {
                accountId
            },
            include: [
                {
                    model: ContentSummaries,
                    as: "summaries",
                    attributes: ["summary", "createdAt"],
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    required: false
                }
            ]
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!contents) return {
            error: true,
            message: "Não foi possível obter a lista de conteúdos.",
            id: "internal_server_error"
        }

        return contents
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findById(id, accountId) {
        const content = await Contents.findOne({
            where: {
                id,
                accountId
            }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!content) return {
            error: true,
            message: "Não foi possível encontrar um conteúdo com o identificador informado.",
            id: "content_not_found"
        }

        return content
    }

    /**
     * @param {number} accountId
     * @param {string} content
     */
    async create(accountId, content) {
        const now = Date.now()

        const newContent = await Contents.create({
            accountId,
            content,
            notifications: 0,
            createTimestamp: now,
            lastNotificationTimestamp: now
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!newContent) return {
            error: true,
            message: "Não foi possível criar o conteúdo.",
            id: "internal_server_error"
        }

        return newContent
    }

    /**
     * @param {number} id
     * @param {number} accountId
     * @param {string} content
     */
    async update(id, accountId, content) {
        const updateContent = await Contents.update(
            { content },
            {
                where: { id, accountId }
            }
        ).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!updateContent) return {
            error: true,
            message: "Não foi possível atualizar o conteúdo.",
            id: "internal_server_error"
        }

        return true
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async delete(id, accountId) {
        const deleteContent = await Contents.destroy({
            where: { id, accountId }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!deleteContent) return {
            error: true,
            message: "Não foi possível deletar o conteúdo.",
            id: "content_not_found"
        }

        return true
    }

    /**
     * @param {number} id
     * @param {number} notifications
     * @param {number} lastNotificationTimestamp
     */
    async updateNotification(id, notifications, lastNotificationTimestamp) {
        const update = await Contents.update(
            { notifications, lastNotificationTimestamp },
            {
                where: { id }
            }
        ).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!update) return {
            error: true,
            message: "Não foi possível atualizar a notificação do conteúdo.",
            id: "internal_server_error"
        }

        return true
    }

    async findAll() {
        const contents = await Contents.findAll().catch((e) => {
            console.log(e)
            return undefined
        })

        if (!contents) return {
            error: true,
            message: "Não foi possível obter a lista de conteúdos.",
            id: "internal_server_error"
        }

        return contents
    }
}

module.exports = new ContentRepository()