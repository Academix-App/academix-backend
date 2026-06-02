const express = require("express")
const zod = require("zod")
const AiSummaryService = require("../services/aiSummary.service")

class AiSummaryController {
    constructor() {
        this.summarySchema = zod.object({
            content: zod
                .string({
                    required_error: "O conteúdo é obrigatório",
                    invalid_type_error: "O conteúdo deve ser um texto válido"
                })
                .min(10, "O conteúdo deve ter pelo menos 10 caracteres.")
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const { content } = req.body

        const result = await AiSummaryService.execute(req.account.id, content)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Resumo gerado com sucesso.",
            data: result.summary
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async index(req, res) {
        const result = await AiSummaryService.findAll(req.account.id)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Resumos listados com sucesso.",
            data: result
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async delete(req, res) {
        const { id } = req.params

        const result = await AiSummaryService.delete(id)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Resumo removido com sucesso.",
            data: {}
        })
    }
}

module.exports = new AiSummaryController()