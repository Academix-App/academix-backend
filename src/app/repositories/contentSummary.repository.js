const ContentSummaries = require("../database/models/contentsSummaries")

class ContentSummaryRepository {
    /**
     * @param {number} contentId
     */
    async findAllByContentId(contentId) {
        const summaries = await ContentSummaries.findAll({
            where: {
                contentId
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!summaries) return {
            error: true,
            message: "Não foi possível obter o histórico de summaries.",
            id: "internal_server_error"
        }

        return summaries
    }

    /**
     * @param {number} contentId
     * @param {string} summary
     */
    async create(contentId, summary) {
        const newSummary = await ContentSummaries.create({
            contentId,
            summary,
            createdAt: Date.now()
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!newSummary) return {
            error: true,
            message: "Não foi possível salvar o summary gerado.",
            id: "internal_server_error"
        }

        return newSummary
    }
}

module.exports = new ContentSummaryRepository()