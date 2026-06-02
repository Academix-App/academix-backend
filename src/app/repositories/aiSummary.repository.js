const AiSummary = require("../database/models/aiSummary")

class AiSummaryRepository {
    /**
     * @param {number} id
     */
    async findById(id) {
        const summary = await AiSummary.findOne({
            where: {
                id
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!summary) return {
            error: true,
            message: "Não foi possível encontrar o resumo informado.",
            id: "summary_not_found"
        }

        return summary
    }

    /**
     * @param {number} accountId
     */
    async findAll(accountId) {
        const summaries = await AiSummary.findAll({
            where: {
                accountId
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!summaries) return {
            error: true,
            message: "Não foi possível listar os resumos.",
            id: "internal_server_error"
        }

        return summaries
    }

    /**
     * @param {number} accountId
     * @param {string} content
     * @param {string} summary
     */
    async create(accountId, content, summary) {
        const aiSummary = await AiSummary.create({
            accountId,
            content,
            summary
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!aiSummary) return {
            error: true,
            message: "Não foi possível criar o resumo.",
            id: "internal_server_error"
        }

        return aiSummary
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const deletedSummary = await AiSummary.destroy({
            where: {
                id
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!deletedSummary) return {
            error: true,
            message: "Não foi possível remover o resumo.",
            id: "internal_server_error"
        }

        return true
    }
}

module.exports = new AiSummaryRepository()