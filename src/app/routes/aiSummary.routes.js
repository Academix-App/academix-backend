const Router = require('express').Router()

const AiSummaryController = require('../controllers/aiSummary.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /ai-summaries:
 *   post:
 *     summary: Gerar resumo com IA
 *     tags: [AI Summary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *     responses:
 *       200:
 *         description: Resumo gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao gerar resumo
 */
Router.post("/ai-summaries", AuthMiddleware, SchemaParserMiddleware(AiSummaryController.summarySchema), AiSummaryController.create)

/**
 * @swagger
 * /ai-summaries:
 *   get:
 *     summary: Listar todos os resumos do usuário
 *     tags: [AI Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumos listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao listar resumos
 */
Router.get("/ai-summaries", AuthMiddleware, AiSummaryController.index)

/**
 * @swagger
 * /ai-summaries/{id}:
 *   delete:
 *     summary: Deletar um resumo
 *     tags: [AI Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do resumo
 *     responses:
 *       200:
 *         description: Resumo removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao deletar resumo
 */
Router.delete("/ai-summaries/:id", AuthMiddleware, AiSummaryController.delete)

module.exports = Router