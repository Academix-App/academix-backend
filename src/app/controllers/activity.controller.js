const express = require('express')
const zod = require('zod')

const ActivityService = require('../services/activity.service')

class ActivityController {
    constructor() {
        this.activitySchema = zod.object({
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
            startDate: zod
                .number({
                    invalid_type_error: "A data de início deve ser um número válido."
                })
                .int("A data de início deve ser um número válido.")
                .positive("A data de início deve ser um número válido.")
                .optional(),
            endDate: zod
                .number({
                    invalid_type_error: "A data de término deve ser um número válido."
                })
                .int("A data de término deve ser um número válido.")
                .positive("A data de término deve ser um número válido.")
                .optional()
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const { title, color, type, status, description, startDate, endDate } = req.body

        const activity = await ActivityService.create({
            accountId: req.account.id,
            title,
            color,
            type,
            status,
            description: description ?? null,
            startDate,
            endDate
        })

        if (activity?.error) return res.status(500).json(activity)

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
    async index(req, res) {
        const { startDate, endDate } = req.query

        const activities = await ActivityService.findAllByAccountId(req.account.id, {
            startDate,
            endDate
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
    async show(req, res) {
        const { id } = req.params

        const activity = await ActivityService.findByIdForAccount(id, req.account.id)
        if (activity?.error) return res.status(activity.status || 404).json(activity)

        return res.status(200).json({
            error: false,
            message: "Atividade obtida com sucesso.",
            data: activity
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async update(req, res) {
        const { id } = req.params
        const { title, color, type, status, description, startDate, endDate } = req.body

        const result = await ActivityService.updateForAccount(id, req.account.id, {
            title,
            color,
            type,
            status,
            description: description ?? null,
            startDate,
            endDate
        })

        if (result?.error) return res.status(result.status).json(result)

        return res.status(200).json({
            error: false,
            message: "Atividade atualizada com sucesso.",
            data: result
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async destroy(req, res) {
        const { id } = req.params

        const result = await ActivityService.deleteForAccount(id, req.account.id)
        if (result?.error) return res.status(result.status).json(result)

        return res.status(200).json({
            error: false,
            message: "Atividade removida com sucesso.",
            data: {}
        })
    }
}

module.exports = new ActivityController()
