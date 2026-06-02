const express = require('express')
const zod = require('zod')

const BotService = require('../services/bot.service')

class BotController {
    constructor() {
        this.disciplineSchema = zod.object({
            accountId: zod.number({
                required_error: "O ID da conta é obrigatório",
                invalid_type_error: "O ID da conta deve ser um número válido."
            }).int("O ID da conta deve ser um número válido.").positive("O ID da conta deve ser um número válido."),
            name: zod
                .string({
                    required_error: "O nome é obrigatório",
                    invalid_type_error: "O nome é obrigatório"
                })
                .min(1, "O nome é obrigatório"),
            teacher: zod
                .string({
                    required_error: "O nome do professor é obrigatório",
                    invalid_type_error: "O nome do professor é obrigatório"
                })
                .min(1, "O nome do professor é obrigatório"),
            color: zod
                .string({
                    required_error: "A cor é obrigatória",
                    invalid_type_error: "A cor é obrigatória"
                })
                .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve estar no formato hexadecimal (#RRGGBB).")
        })

        this.activitySchema = zod.object({
            accountId: zod.number({
                required_error: "O ID da conta é obrigatório",
                invalid_type_error: "O ID da conta deve ser um número válido."
            }).int("O ID da conta deve ser um número válido.").positive("O ID da conta deve ser um número válido."),
            disciplineId: zod.number({
                required_error: "O ID da disciplina é obrigatório",
                invalid_type_error: "O ID da disciplina deve ser um número válido."
            }).int("O ID da disciplina deve ser um número válido.").positive("O ID da disciplina deve ser um número válido."),
            title: zod
                .string({
                    required_error: "O título é obrigatório",
                    invalid_type_error: "O título é obrigatório"
                })
                .min(1, "O título é obrigatório")
                .max(128, "O título deve ter no máximo 128 caracteres."),
            color: zod
                .string({
                    required_error: "A cor é obrigatória",
                    invalid_type_error: "A cor é obrigatória"
                })
                .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve estar no formato hexadecimal (#RRGGBB)."),
            type: zod.enum(['EXAM', 'PRESENTATION', 'ASSIGNMENT', 'OTHER'], {
                required_error: "O tipo é obrigatório",
                invalid_type_error: "Tipo inválido.",
                message: "Tipo inválido."
            }),
            status: zod.enum(['not_delivered', 'delivered'], {
                required_error: "O status é obrigatório",
                invalid_type_error: "Status inválido.",
                message: "Status inválido."
            }),
            description: zod
                .string()
                .max(128, "A descrição deve ter no máximo 128 caracteres.")
                .nullable()
                .optional(),
            startDate: zod
                .number({
                    required_error: "A data de início é obrigatória",
                    invalid_type_error: "A data de início deve ser um número válido."
                })
                .int("A data de início deve ser um número válido.")
                .positive("A data de início deve ser um número válido."),
            endDate: zod
                .number({
                    required_error: "A data de término é obrigatória",
                    invalid_type_error: "A data de término deve ser um número válido."
                })
                .int("A data de término deve ser um número válido.")
                .positive("A data de término deve ser um número válido.")
        }).refine((data) => data.endDate > data.startDate, {
            message: "A data de término deve ser posterior à data de início.",
            path: ["endDate"]
        })

        this.activityQuerySchema = zod.object({
            accountId: zod.coerce.number({
                required_error: "O ID da conta é obrigatório",
                invalid_type_error: "O ID da conta deve ser um número válido."
            }).int("O ID da conta deve ser um número válido.").positive("O ID da conta deve ser um número válido."),
            startDate: zod
                .coerce.number({
                    invalid_type_error: "A data de início deve ser um número válido."
                })
                .int("A data de início deve ser um número válido.")
                .positive("A data de início deve ser um número válido.")
                .optional(),
            endDate: zod
                .coerce.number({
                    invalid_type_error: "A data de término deve ser um número válido."
                })
                .int("A data de término deve ser um número válido.")
                .positive("A data de término deve ser um número válido.")
                .optional(),
            disciplineId: zod
                .coerce.number({
                    invalid_type_error: "O ID da disciplina deve ser um número válido."
                })
                .int("O ID da disciplina deve ser um número válido.")
                .positive("O ID da disciplina deve ser um número válido.")
                .optional()
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async createActivity(req, res) {
        const { title, color, type, status, description, startDate, endDate, disciplineId, accountId } = req.body

        const activity = await BotService.createActivity({
            accountId,
            title,
            color,
            type,
            status,
            description: description ?? null,
            startDate,
            endDate,
            disciplineId
        })

        if (activity?.error) return res.status(activity.status || 500).json(activity)

        return res.status(201).json({
            error: false,
            message: "Atividade criada com sucesso.",
            data: activity
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async indexActivities(req, res) {
        const { accountId, startDate, endDate, disciplineId } = req.query

        const activities = await BotService.getActivities(accountId, {
            startDate,
            endDate,
            disciplineId
        })

        return res.status(200).json({
            error: false,
            message: "Atividades obtidas com sucesso.",
            data: activities
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async getDisciplines(req, res) {
        const { accountId } = req.query

        if (!accountId) {
            return res.status(400).json({
                error: true,
                message: "O ID da conta é obrigatório.",
                id: "account_id_required"
            })
        }

        const disciplines = await BotService.getDisciplines(accountId)

        return res.status(200).json({
            error: false,
            message: "Disciplinas obtidas com sucesso.",
            data: disciplines
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async createDiscipline(req, res) {
        const { accountId, name, teacher, color } = req.body

        const discipline = await BotService.createDiscipline({
            accountId,
            name,
            teacher,
            color
        })

        if (discipline?.error) return res.status(discipline.status || 500).json(discipline)

        return res.status(201).json({
            error: false,
            message: "Disciplina criada com sucesso.",
            data: discipline
        })
    }
}

module.exports = new BotController()
