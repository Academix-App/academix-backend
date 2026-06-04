const express = require('express')
const zod = require('zod')
const VerificationService = require('../services/verification.service')

class VerificationController {
    constructor() {
        this.verificationCreateSchema = zod.object({
            input: zod
                .string({
                    required_error: "O conteúdo é obrigatório.",
                    invalid_type_error: "O conteúdo deve ser um texto válido."
                })
                .min(10, "O conteúdo deve ter pelo menos 10 caracteres.")
        }, { message: "Foi fornecida uma estrutura inválida." })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async index(req, res) {
        const verifications = await VerificationService.findAllVerifications(req.account.id)
        if (verifications?.error) return res.status(500).json(verifications)

        return res.status(200).json({
            error: false,
            message: "Histórico de verificações obtido com sucesso.",
            data: verifications
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async show(req, res) {
        const { id } = req.params

        const verification = await VerificationService.findVerificationById(id, req.account.id)
        if (verification?.error) return res.status(404).json(verification)

        return res.status(200).json({
            error: false,
            message: "Verificação obtida com sucesso.",
            data: verification
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const validation = this.verificationCreateSchema.safeParse(req.body)
        if (!validation.success) return res.status(400).json({
            error: true,
            message: validation.error.issues[0].message,
            id: "validation_error"
        })

        const { input } = validation.data

        const verification = await VerificationService.createVerification(req.account.id, input)
        if (verification?.error) return res.status(500).json(verification)

        return res.status(201).json({
            error: false,
            message: "Verificação realizada com sucesso.",
            data: verification
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async delete(req, res) {
        const { id } = req.params

        const verification = await VerificationService.findVerificationById(id, req.account.id)
        if (verification?.error) return res.status(404).json(verification)

        const deletedVerification = await VerificationService.deleteVerification(id, req.account.id)
        if (deletedVerification?.error) return res.status(500).json(deletedVerification)

        return res.status(200).json({
            error: false,
            message: "Verificação deletada com sucesso.",
            data: {}
        })
    }
}

module.exports = new VerificationController()