const VerificationRepository = require("../repositories/verification.repository")
const VerificationAiCommunication = require("../ai/verificationAiCommunication")

class VerificationService {
    /**
     * @param {number} accountId
     */
    async findAllVerifications(accountId) {
        return await VerificationRepository.findAllByAccountId(accountId)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findVerificationById(id, accountId) {
        return await VerificationRepository.findById(id, accountId)
    }

    /**
     * @param {number} accountId
     * @param {string} input
     */
    async createVerification(accountId, input) {
        const result = await VerificationAiCommunication.verify(input)
        if (result?.error) return result

        return await VerificationRepository.create(accountId, input, result.percentage, result.justification)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async deleteVerification(id, accountId) {
        return await VerificationRepository.delete(id, accountId)
    }
}

module.exports = new VerificationService()