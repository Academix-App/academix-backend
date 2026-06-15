const Verifications = require("../database/models/verification")

class VerificationRepository {
    /**
     * @param {number} accountId
     */
    async findAllByAccountId(accountId) {
        const verifications = await Verifications.findAll({
            where: {
                accountId
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!verifications) return {
            error: true,
            message: "Não foi possível obter o histórico de verificações.",
            id: "internal_server_error"
        }

        return verifications
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findById(id, accountId) {
        const verification = await Verifications.findOne({
            where: {
                id,
                accountId
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!verification) return {
            error: true,
            message: "Não foi possível encontrar uma verificação com o identificador informado.",
            id: "verification_not_found"
        }

        return verification
    }

    /**
     * @param {number} accountId
     * @param {string} input
     * @param {number} percentage
     * @param {string} justification
     */
    async create(accountId, input, percentage, justification) {
        const verification = await Verifications.create({
            accountId,
            input,
            percentage,
            justification,
            createdAt: new Date()
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!verification) return {
            error: true,
            message: "Não foi possível salvar a verificação.",
            id: "internal_server_error"
        }

        return verification
    }
    /**
 * @param {number} id
 * @param {number} accountId
 */
async delete(id, accountId) {
    const deleteVerification = await Verifications.destroy({
        where: {
            id,
            accountId
        }
    }).catch((e) => {
        console.log(e)

        return undefined
    })

    if (!deleteVerification) return {
        error: true,
        message: "Não foi possível deletar a verificação.",
        id: "verification_not_found"
    }

    return true
}
}

module.exports = new VerificationRepository()