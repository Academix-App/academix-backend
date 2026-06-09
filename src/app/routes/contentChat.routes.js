const Router = require('express').Router()

const ContentChatController = require('../controllers/contentChat.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /contents/{contentId}/chats:
 *   get:
 *     summary: Listar histórico de mensagens de um conteúdo
 *     tags: [ContentChat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo
 *     responses:
 *       200:
 *         description: Histórico obtido com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       401:
 *         description: Não autorizado
 */
Router.get("/contents/:contentId/chats", AuthMiddleware, ContentChatController.index.bind(ContentChatController))

/**
 * @swagger
 * /contents/{contentId}/chats:
 *   post:
 *     summary: Enviar mensagem e receber resposta da IA
 *     tags: [ContentChat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Pode me dar um exemplo prático?"
 *     responses:
 *       201:
 *         description: Mensagem enviada e resposta gerada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Conteúdo não encontrado
 *       500:
 *         description: Erro interno
 *       401:
 *         description: Não autorizado
 */
Router.post("/contents/:contentId/chats", AuthMiddleware, ContentChatController.create.bind(ContentChatController))

module.exports = Router