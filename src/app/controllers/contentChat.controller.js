const express = require('express')
const zod = require('zod')
const ContentChatService = require('../services/ContentChat.service')

class ContentChatController {
    constructor() {
        this.sendMessageSchema = zod.object({
            message: zod
                .string({
                    required_error: "A mensagem é obrigatória.",
                    invalid_type_error: "A mensagem deve ser um texto válido."
                })
                .min(1, "A mensagem não pode ser vazia.")
                .max(2000, "A mensagem deve ter no máximo 2000 caracteres.")
        }, { message: "Foi fornecida uma estrutura inválida." })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async index(req, res) {
        const { contentId } = req.params

        const messages = await ContentChatService.findAllMessages(contentId, req.account.id)
        if (messages?.error) return res.status(404).json(messages)

        return res.status(200).json({
            error: false,
            message: "Histórico da conversa obtido com sucesso.",
            data: messages
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const { contentId } = req.params

        const validation = this.sendMessageSchema.safeParse(req.body)
        if (!validation.success) return res.status(400).json({
            error: true,
            message: validation.error.issues[0].message,
            id: "validation_error"
        })

        const { message } = validation.data

        const response = await ContentChatService.sendMessage(contentId, req.account.id, message)
        if (response?.error) return res.status(500).json(response)

        return res.status(201).json({
            error: false,
            message: "Mensagem enviada com sucesso.",
            data: response
        })
    }
}

module.exports = new ContentChatController()