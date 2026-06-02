const AiVerification = require("../database/models/aiVerification")

class AiVerificationRepository {
    /**
     * @param {number} id
     */
    async findById(id) {
        const verification = await AiVerification.findOne({
            where: {
                id
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!verification) return {
            error: true,
            message: "Não foi possível encontrar a verificação informada.",
            id: "verification_not_found"
        }

        return verification
    }

    /**
     * @param {number} accountId
     */
    async findAll(accountId) {
        const verifications = await AiVerification.findAll({
            where: {
                accountId
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!verifications) return {
            error: true,
            message: "Não foi possível listar as verificações.",
            id: "internal_server_error"
        }

        return verifications
    }

    /**
     * @param {number} accountId
     * @param {string} content
     * @param {number} score
     * @param {string} feedback
     */
    async create(accountId, content, score, feedback) {
        const aiVerification = await AiVerification.create({
            accountId,
            content,
            score,
            feedback
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!aiVerification) return {
            error: true,
            message: "Não foi possível criar a verificação.",
            id: "internal_server_error"
        }

        return aiVerification
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const deletedVerification = await AiVerification.destroy({
            where: {
                id
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!deletedVerification) return {
            error: true,
            message: "Não foi possível remover a verificação.",
            id: "internal_server_error"
        }

        return true
    }
}

module.exports = new AiVerificationRepository()