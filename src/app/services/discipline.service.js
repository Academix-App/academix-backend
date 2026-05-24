const DisciplineRepository = require("../repositories/discipline.repository")

class DisciplineService {
    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findByIdForAccount(id, accountId) {
        const discipline = await DisciplineRepository.findByIdWithAccount(id)
        if (discipline?.error) return discipline

        if (discipline.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Não foi possível encontrar a disciplina informada.",
                id: "discipline_not_found",
                status: 404
            }
        }

        return await DisciplineRepository.findById(id)
    }

    /**
     * @param {number} accountId
     */
    async findAllByAccountId(accountId) {
        return await DisciplineRepository.findAllByAccountId(accountId)
    }

    /**
     * @param {Object} data
     */
    async create(data) {
        return await DisciplineRepository.create(data)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     * @param {Object} data
     */
    async updateForAccount(id, accountId, data) {
        const discipline = await DisciplineRepository.findByIdWithAccount(id)
        if (discipline?.error) return { ...discipline, status: 404 }

        if (discipline.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Você não tem permissão para modificar esta disciplina.",
                id: "discipline_forbidden",
                status: 403
            }
        }

        await DisciplineRepository.update(id, data)
        return await DisciplineRepository.findById(id)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async deleteForAccount(id, accountId) {
        const discipline = await DisciplineRepository.findByIdWithAccount(id)
        if (discipline?.error) return { ...discipline, status: 404 }

        if (discipline.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Você não tem permissão para modificar esta disciplina.",
                id: "discipline_forbidden",
                status: 403
            }
        }

        await DisciplineRepository.delete(id)
        return { error: false }
    }
}

module.exports = new DisciplineService()
