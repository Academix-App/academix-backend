const express = require("express")
const zod = require("zod")
const AiVerificationService = require("../services/aiVerification.service")

class AiVerificationController {
    constructor() {
        this.verificationSchema = zod.object({
            content: zod
                .string({
                    required_error: "O conteúdo é obrigatório",
                    invalid_type_error: "O conteúdo deve ser um texto válido"
                })
                .min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
            referenceContent: zod
                .string({
                    required_error: "O conteúdo de referência é obrigatório",
                    invalid_type_error: "O conteúdo de referência deve ser um texto válido"
                })
                .min(10, "O conteúdo de referência deve ter pelo menos 10 caracteres.")
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const { content, referenceContent } = req.body

        const result = await AiVerificationService.execute(req.account.id, content, referenceContent)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Verificação realizada com sucesso.",
            data: result.verification
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async index(req, res) {
        const result = await AiVerificationService.findAll(req.account.id)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Verificações listadas com sucesso.",
            data: result
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async delete(req, res) {
        const { id } = req.params

        const result = await AiVerificationService.delete(id)
        if (result?.error) return res.status(500).json(result)

        return res.status(200).json({
            error: false,
            message: "Verificação removida com sucesso.",
            data: {}
        })
    }
}

module.exports = new AiVerificationController()