const ContentSummaryRepository = require("../repositories/contentSummary.repository")

class ContentSummaryService {
    /**
     * @param {number} contentId
     */
    async findAllSummaries(contentId) {
        return await ContentSummaryRepository.findAllByContentId(contentId)
    }
}

module.exports = new ContentSummaryService()