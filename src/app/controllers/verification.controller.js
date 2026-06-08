const express = require('express')
const zod = require('zod')
const VerificationService = require('../services/verification.service')

const ALLOWED_MIME_TYPES = ["application/pdf"]
const MAX_FILE_SIZE_MB = 10

class VerificationController {
    constructor() {
        this.verificationCreateSchema = zod
            .object({
                input: zod
                    .string({
                        invalid_type_error: "O conteúdo deve ser um texto válido."
                    })
                    .min(10, "O conteúdo deve ter pelo menos 10 caracteres.")
                    .optional()
            }, { message: "Foi fornecida uma estrutura inválida." })
            .refine(
                (data) => data.input !== undefined || data._hasPdf,
                { message: "Envie um texto, uma URL ou um arquivo PDF." }
            )
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
        const pdfFile = req.file ?? null

        if (pdfFile) {
            if (!ALLOWED_MIME_TYPES.includes(pdfFile.mimetype)) {
                return res.status(400).json({
                    error: true,
                    message: "Apenas arquivos PDF são permitidos.",
                    id: "invalid_file_type"
                })
            }

            if (pdfFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                return res.status(400).json({
                    error: true,
                    message: `O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`,
                    id: "file_too_large"
                })
            }
        }

        const validation = this.verificationCreateSchema.safeParse({
            ...req.body,
            _hasPdf: !!pdfFile
        })

        if (!validation.success) return res.status(400).json({
            error: true,
            message: validation.error.issues[0].message,
            id: "validation_error"
        })

        const input = validation.data.input ?? null
        const pdfBuffer = pdfFile?.buffer ?? null

        const verification = await VerificationService.createVerification(
            req.account.id,
            input,
            pdfBuffer
        )
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