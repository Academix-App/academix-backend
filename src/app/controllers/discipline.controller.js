const express = require('express')
const zod = require('zod')

const DisciplineService = require('../services/discipline.service')

class DisciplineController {
    constructor() {
        this.disciplineSchema = zod.object({
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
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const { name, teacher, color } = req.body

        const discipline = await DisciplineService.create({
            accountId: req.account.id,
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

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async index(req, res) {
        const disciplines = await DisciplineService.findAllByAccountId(req.account.id)

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
    async show(req, res) {
        const { id } = req.params

        const discipline = await DisciplineService.findByIdForAccount(id, req.account.id)
        if (discipline?.error) return res.status(discipline.status || 404).json(discipline)

        return res.status(200).json({
            error: false,
            message: "Disciplina obtida com sucesso.",
            data: discipline
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async update(req, res) {
        const { id } = req.params
        const { name, teacher, color } = req.body

        const result = await DisciplineService.updateForAccount(id, req.account.id, {
            name,
            teacher,
            color
        })

        if (result?.error) return res.status(result.status).json(result)

        return res.status(200).json({
            error: false,
            message: "Disciplina atualizada com sucesso.",
            data: result
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async destroy(req, res) {
        const { id } = req.params

        const result = await DisciplineService.deleteForAccount(id, req.account.id)
        if (result?.error) return res.status(result.status).json(result)

        return res.status(200).json({
            error: false,
            message: "Disciplina removida com sucesso.",
            data: {}
        })
    }
}

module.exports = new DisciplineController()
