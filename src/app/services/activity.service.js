const ActivityRepository = require("../repositories/activity.repository")
const DisciplineRepository = require("../repositories/discipline.repository")

class ActivityService {
    /**
     * @param {number} id
     * @param {number} accountId
     */
    async findByIdForAccount(id, accountId) {
        const activity = await ActivityRepository.findByIdWithAccount(id)
        if (activity?.error) return activity

        if (activity.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Não foi possível encontrar a atividade informada.",
                id: "activity_not_found",
                status: 404
            }
        }

        return await ActivityRepository.findById(id)
    }

    /**
     * @param {number} accountId
     * @param {Object} filters
     */
    async findAllByAccountId(accountId, filters) {
        return await ActivityRepository.findAllByAccountId(accountId, filters)
    }

    /**
     * @param {Object} data
     */
    async create(data) {
        const discipline = await DisciplineRepository.findById(data.disciplineId)
        if (discipline?.error) {
            return {
                error: true,
                message: "Disciplina não encontrada.",
                id: "discipline_not_found",
                status: 404
            }
        }

        if (discipline.dataValues.accountId !== data.accountId) {
            return {
                error: true,
                message: "Você não tem permissão para adicionar atividades a esta disciplina.",
                id: "discipline_forbidden",
                status: 403
            }
        }

        return await ActivityRepository.create(data)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     * @param {Object} data
     */
    async updateForAccount(id, accountId, data) {
        const activity = await ActivityRepository.findByIdWithAccount(id)
        if (activity?.error) return { ...activity, status: 404 }

        if (activity.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Você não tem permissão para modificar esta atividade.",
                id: "activity_forbidden",
                status: 403
            }
        }

        const discipline = await DisciplineRepository.findById(data.disciplineId)
        if (discipline?.error) {
            return {
                error: true,
                message: "Disciplina não encontrada.",
                id: "discipline_not_found",
                status: 404
            }
        }

        if (discipline.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Você não tem permissão para modificar esta atividade.",
                id: "discipline_forbidden",
                status: 403
            }
        }

        await ActivityRepository.update(id, data)
        return await ActivityRepository.findById(id)
    }

    /**
     * @param {number} id
     * @param {number} accountId
     */
    async deleteForAccount(id, accountId) {
        const activity = await ActivityRepository.findByIdWithAccount(id)
        if (activity?.error) return { ...activity, status: 404 }

        if (activity.dataValues.accountId !== accountId) {
            return {
                error: true,
                message: "Você não tem permissão para modificar esta atividade.",
                id: "activity_forbidden",
                status: 403
            }
        }

        await ActivityRepository.delete(id)
        return { error: false }
    }
}

module.exports = new ActivityService()
