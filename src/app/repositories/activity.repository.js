const { Op } = require("sequelize")
const Activities = require("../database/models/activity")

class ActivityRepository {
    /**
     * @param {number} id
     */
    async findById(id) {
        const activity = await Activities.findOne({
            where: { id },
            attributes: { exclude: ['accountId'] }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!activity) return {
            error: true,
            message: "Não foi possível encontrar a atividade informada.",
            id: "activity_not_found"
        }

        return activity
    }

    /**
     * @param {number} id
     */
    async findByIdWithAccount(id) {
        const activity = await Activities.findOne({
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!activity) return {
            error: true,
            message: "Não foi possível encontrar a atividade informada.",
            id: "activity_not_found"
        }

        return activity
    }

    /**
     * @param {number} accountId
     * @param {Object} filters
     * @param {number} [filters.startDate]
     * @param {number} [filters.endDate]
     */
    async findAllByAccountId(accountId, filters = {}) {
        const where = { accountId }

        if (filters.startDate) {
            where.startDate = { [Op.gte]: filters.startDate }
        }

        if (filters.endDate) {
            where.endDate = { ...(where.endDate || {}), [Op.lte]: filters.endDate }
        }

        const activities = await Activities.findAll({
            where,
            attributes: { exclude: ['accountId'] }
        }).catch((e) => {
            console.log(e)
            return []
        })

        return activities
    }

    /**
     * @param {Object} data
     */
    async create(data) {
        const activity = await Activities.create(data).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!activity) return {
            error: true,
            message: "Não foi possível criar a atividade.",
            id: "activity_creation_failed"
        }

        delete activity.dataValues.accountId

        return activity
    }

    /**
     * @param {number} id
     * @param {Object} data
     */
    async update(id, data) {
        const result = await Activities.update(data, {
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!result) return {
            error: true,
            message: "Não foi possível atualizar a atividade.",
            id: "activity_update_failed"
        }

        return result
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const result = await Activities.destroy({
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (result === undefined) return {
            error: true,
            message: "Não foi possível remover a atividade.",
            id: "activity_delete_failed"
        }

        return result
    }
}

module.exports = new ActivityRepository()
