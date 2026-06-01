const ActivityService = require('./activity.service')
const DisciplineRepository = require('../repositories/discipline.repository')

class BotService {
    /**
     * @param {Object} data
     */
    async createActivity(data) {
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

        return await ActivityService.create(data)
    }

    /**
     * @param {number} accountId
     * @param {Object} filters
     */
    async getActivities(accountId, filters) {
        return await ActivityService.findAllByAccountId(accountId, filters)
    }

    /**
     * Listar disciplinas de uma conta
     * @param {number} accountId
     */
    async getDisciplines(accountId) {
        const disciplines = await DisciplineRepository.findAllByAccountId(accountId)
        return disciplines || []
    }
}

module.exports = new BotService()
