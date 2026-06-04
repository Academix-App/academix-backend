const Router = require('express').Router()

const ContentController = require('../controllers/content.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Listar todos os conteúdos da conta autenticada
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteúdos obtidos com sucesso
 *       401:
 *         description: Não autorizado
 */
Router.get("/contents", AuthMiddleware, ContentController.index.bind(ContentController))

/**
 * @swagger
 * /contents/{id}:
 *   get:
 *     summary: Obter conteúdo por ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo
 *     responses:
 *       200:
 *         description: Conteúdo obtido com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       401:
 *         description: Não autorizado
 */
Router.get("/contents/:id", AuthMiddleware, ContentController.show.bind(ContentController))

/**
 * @swagger
 * /contents/{id}/summaries:
 *   get:
 *     summary: Listar histórico de summaries de um conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
Router.get("/contents/:id/summaries", AuthMiddleware, ContentController.showSummaries.bind(ContentController))

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Criar novo conteúdo
 *     tags: [Content]
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
 *                 example: "Conteúdo a ser memorizado..."
 *     responses:
 *       201:
 *         description: Conteúdo criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
Router.post("/contents", AuthMiddleware, SchemaParserMiddleware(ContentController.contentCreateSchema), ContentController.create.bind(ContentController))

/**
 * @swagger
 * /contents/{id}:
 *   put:
 *     summary: Atualizar conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Conteúdo atualizado..."
 *     responses:
 *       200:
 *         description: Conteúdo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Conteúdo não encontrado
 *       401:
 *         description: Não autorizado
 */
Router.put("/contents/:id", AuthMiddleware, SchemaParserMiddleware(ContentController.contentUpdateSchema), ContentController.update.bind(ContentController))

/**
 * @swagger
 * /contents/{id}:
 *   delete:
 *     summary: Deletar conteúdo
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do conteúdo
 *     responses:
 *       200:
 *         description: Conteúdo deletado com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *       401:
 *         description: Não autorizado
 */
Router.delete("/contents/:id", AuthMiddleware, ContentController.delete.bind(ContentController))

module.exports = Router