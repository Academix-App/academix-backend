const SummaryAICommunication = require("./ai/summaryAiCommunication")
const AiSummaryRepository = require("../repositories/aiSummary.repository")

class AiSummaryService {
    /**
     * @param {number} accountId
     * @param {string} content
     */
    async execute(accountId, content) {
        const aiResponse = await SummaryAICommunication.generateSummary(content)

        if (aiResponse.error) return aiResponse

        const savedSummary = await AiSummaryRepository.create(
            accountId,
            content,
            aiResponse.summary
        )

        if (savedSummary.error) return savedSummary

        return {
            summary: savedSummary
        }
    }

    /**
     * @param {number} accountId
     */
    async findAll(accountId) {
        const summaries = await AiSummaryRepository.findAll(accountId)

        if (summaries.error) return summaries

        return summaries
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const deleted = await AiSummaryRepository.delete(id)

        if (deleted.error) return deleted

        return true
    }
}

module.exports = new AiSummaryService()