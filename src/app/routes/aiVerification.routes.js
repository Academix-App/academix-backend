const Router = require('express').Router()

const AiVerificationController = require('../controllers/aiVerification.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /ai-verifications:
 *   post:
 *     summary: Verificar conteúdo com IA
 *     tags: [AI Verification]
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
 *               - referenceContent
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *               referenceContent:
 *                 type: string
 *                 example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor..."
 *     responses:
 *       200:
 *         description: Verificação realizada com sucesso
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
 *         description: Erro ao verificar conteúdo
 */
Router.post("/ai-verifications", AuthMiddleware, SchemaParserMiddleware(AiVerificationController.verificationSchema), AiVerificationController.create)

/**
 * @swagger
 * /ai-verifications:
 *   get:
 *     summary: Listar todas as verificações do usuário
 *     tags: [AI Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verificações listadas com sucesso
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
 *         description: Erro ao listar verificações
 */
Router.get("/ai-verifications", AuthMiddleware, AiVerificationController.index)

/**
 * @swagger
 * /ai-verifications/{id}:
 *   delete:
 *     summary: Deletar uma verificação
 *     tags: [AI Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da verificação
 *     responses:
 *       200:
 *         description: Verificação removida com sucesso
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
 *         description: Erro ao deletar verificação
 */
Router.delete("/ai-verifications/:id", AuthMiddleware, AiVerificationController.delete)

module.exports = Router