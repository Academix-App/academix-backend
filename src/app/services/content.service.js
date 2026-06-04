const ContentRepository = require("../repositories/content.repository")

class ContentService {
    /**
     * @param {number} accountId
     */
    async findAllContents(accountId) {
        return await ContentRepository.findAllByAccountId(accountId)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findContentById(id, accountId) {
        return await ContentRepository.findById(id, accountId)
    }

    /**
     * @param {number} accountId
     * @param {string} content
     */
    async createContent(accountId, content) {
        return await ContentRepository.create(accountId, content)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     * @param {string} content
     */
    async updateContent(id, accountId, content) {
        return await ContentRepository.update(id, accountId, content)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async deleteContent(id, accountId) {
        return await ContentRepository.delete(id, accountId)
    }
}

module.exports = new ContentService()