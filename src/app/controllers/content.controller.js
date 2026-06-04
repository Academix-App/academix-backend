const express = require('express')
const zod = require('zod')
const ContentService = require('../services/content.service')
const ContentSummaryService = require('../services/contenSummary.service')

class ContentController {
    constructor() {
        this.contentCreateSchema = zod.object({
            content: zod
                .string({
                    required_error: "O conteúdo é obrigatório.",
                    invalid_type_error: "O conteúdo deve ser um texto válido."
                })
                .min(10, "O conteúdo deve ter pelo menos 10 caracteres.")
        }, { message: "Foi fornecida uma estrutura inválida." })

        this.contentUpdateSchema = zod.object({
            content: zod
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
        const contents = await ContentService.findAllContents(req.account.id)
        if (contents?.error) return res.status(500).json(contents)

        return res.status(200).json({
            error: false,
            message: "Conteúdos obtidos com sucesso.",
            data: contents
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async show(req, res) {
        const { id } = req.params

        const content = await ContentService.findContentById(id, req.account.id)
        if (content?.error) return res.status(404).json(content)

        return res.status(200).json({
            error: false,
            message: "Conteúdo obtido com sucesso.",
            data: content
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async showSummaries(req, res) {
        const { id } = req.params

        const content = await ContentService.findContentById(id, req.account.id)
        if (content?.error) return res.status(404).json(content)

        const summaries = await ContentSummaryService.findAllSummaries(id)
        if (summaries?.error) return res.status(500).json(summaries)

        return res.status(200).json({
            error: false,
            message: "Histórico de summaries obtido com sucesso.",
            data: summaries
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async create(req, res) {
        const validation = this.contentCreateSchema.safeParse(req.body)
        if (!validation.success) return res.status(400).json({
            error: true,
            message: validation.error.issues[0].message,
            id: "validation_error"
        })

        const { content } = validation.data

        const newContent = await ContentService.createContent(req.account.id, content)
        if (newContent?.error) return res.status(500).json(newContent)

        return res.status(201).json({
            error: false,
            message: "Conteúdo criado com sucesso.",
            data: newContent
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async update(req, res) {
        const { id } = req.params

        const validation = this.contentUpdateSchema.safeParse(req.body)
        if (!validation.success) return res.status(400).json({
            error: true,
            message: validation.error.issues[0].message,
            id: "validation_error"
        })

        const content = await ContentService.findContentById(id, req.account.id)
        if (content?.error) return res.status(404).json(content)

        const updatedContent = await ContentService.updateContent(id, req.account.id, validation.data.content)
        if (updatedContent?.error) return res.status(500).json(updatedContent)

        return res.status(200).json({
            error: false,
            message: "Conteúdo atualizado com sucesso.",
            data: {}
        })
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    async delete(req, res) {
        const { id } = req.params

        const content = await ContentService.findContentById(id, req.account.id)
        if (content?.error) return res.status(404).json(content)

        const deletedContent = await ContentService.deleteContent(id, req.account.id)
        if (deletedContent?.error) return res.status(500).json(deletedContent)

        return res.status(200).json({
            error: false,
            message: "Conteúdo deletado com sucesso.",
            data: {}
        })
    }
}

module.exports = new ContentController()