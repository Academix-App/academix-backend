const { Op } = require("sequelize")
const Disciplines = require("../database/models/discipline")

class DisciplineRepository {
    /**
     * @param {number} id
     */
    async findById(id) {
        const discipline = await Disciplines.findOne({
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!discipline) return {
            error: true,
            message: "Não foi possível encontrar a disciplina informada.",
            id: "discipline_not_found"
        }

        return discipline
    }

    /**
     * @param {number} id
     */
    async findByIdWithAccount(id) {
        const discipline = await Disciplines.findOne({
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!discipline) return {
            error: true,
            message: "Não foi possível encontrar a disciplina informada.",
            id: "discipline_not_found"
        }

        return discipline
    }

    /**
     * @param {number} accountId
     */
    async findAllByAccountId(accountId) {
        const disciplines = await Disciplines.findAll({
            where: { accountId },
            attributes: { exclude: ['accountId'] }
        }).catch((e) => {
            console.log(e)
            return []
        })

        return disciplines
    }

    /**
     * @param {Object} data
     */
    async create(data) {
        const discipline = await Disciplines.create(data).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!discipline) return {
            error: true,
            message: "Não foi possível criar a disciplina.",
            id: "discipline_creation_failed"
        }

        delete discipline.dataValues.accountId

        return discipline
    }

    /**
     * @param {number} id
     * @param {Object} data
     */
    async update(id, data) {
        const result = await Disciplines.update(data, {
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (!result) return {
            error: true,
            message: "Não foi possível atualizar a disciplina.",
            id: "discipline_update_failed"
        }

        return result
    }

    /**
     * @param {number} id
     */
    async delete(id) {
        const result = await Disciplines.destroy({
            where: { id }
        }).catch((e) => {
            console.log(e)
            return undefined
        })

        if (result === undefined) return {
            error: true,
            message: "Não foi possível remover a disciplina.",
            id: "discipline_delete_failed"
        }

        return result
    }
}

module.exports = new DisciplineRepository()
