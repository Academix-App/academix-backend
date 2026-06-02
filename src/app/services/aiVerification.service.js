const VerificationAICommunication = require('./ai/verificationAiCommunication')
const AiVerificationRepository = require("../repositories/aiVerification.repository")

class AiVerificationService {
    /**
     * @param {number} accountId
     * @param {string} content
     * @param {string} referenceContent
     */
    async execute(accountId, content, referenceContent) {
        const aiResponse = await VerificationAICommunication.verify(
            content,
            referenceContent
        )

        if (aiResponse.error) return aiResponse

        const savedVerification = await AiVerificationRepository.create(
            accountId,
            content,
            aiResponse.score,
            aiResponse.feedback
        )

        if (savedVerification.error) return savedVerification

        return {
            verification: savedVerification
        }
    }

    /**
     * @param {number} accountId
     */
    async findAll(accountId) {
        const verifications = await AiVerificationRepository.findAll(accountId)

        if (verifications.error) return verifications

        return verifications
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const deleted = await AiVerificationRepository.delete(id)

        if (deleted.error) return deleted

        return true
    }
}

module.exports = new AiVerificationService()