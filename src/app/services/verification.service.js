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
     * @param {string|null} input
     * @param {Buffer|null} pdfBuffer
     */
    async createVerification(accountId, input, pdfBuffer) {
        const result = await VerificationAiCommunication.verify(input, pdfBuffer)
        if (result?.error) return result

        const storedInput = input ?? "PDF enviado pelo usuário"

        return await VerificationRepository.create(accountId, storedInput, result.percentage, result.justification)
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