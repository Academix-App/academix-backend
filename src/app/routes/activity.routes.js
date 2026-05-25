const Router = require('express').Router()

const ActivityController = require('../controllers/activity.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Criar uma nova atividade
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
	*               - title
	*               - color
	*               - type
	*               - status
	*               - startDate
	*               - endDate
	*               - disciplineId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Prova de Cálculo
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *               type:
 *                 type: string
 *                 enum: [EXAM, PRESENTATION, ASSIGNMENT, OTHER]
 *               status:
 *                 type: string
 *                 enum: [not_delivered, delivered]
 *               description:
 *                 type: string
 *                 nullable: true
	*               disciplineId:
	*                 type: integer
	*                 example: 1
 *               startDate:
 *                 type: number
 *                 example: 1700000000000
 *               endDate:
 *                 type: number
 *                 example: 1700003600000
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *       400:
 *         description: Estrutura inválida
 *       401:
 *         description: Não autorizado
 */
Router.post("/activities", AuthMiddleware, SchemaParserMiddleware(ActivityController.activitySchema), ActivityController.create)

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Listar atividades do usuário autenticado
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: number
 *         description: Filtrar por data de início (UNIX timestamp)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: number
 *         description: Filtrar por data de término (UNIX timestamp)
	*       - in: query
	*         name: disciplineId
	*         schema:
	*           type: integer
	*         description: Filtrar por disciplina (ID da disciplina)
 *     responses:
 *       200:
 *         description: Atividades obtidas com sucesso
 *       401:
 *         description: Não autorizado
 */
Router.get("/activities", AuthMiddleware, SchemaParserMiddleware(null, ActivityController.activityQuerySchema), ActivityController.index)

/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Buscar atividade por ID
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade obtida com sucesso
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.get("/activities/:id", AuthMiddleware, ActivityController.show)

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Atualizar atividade
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
	*               - title
	*               - color
	*               - type
	*               - status
	*               - startDate
	*               - endDate
	*               - disciplineId
 *             properties:
 *               title:
 *                 type: string
 *               color:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [EXAM, PRESENTATION, ASSIGNMENT, OTHER]
 *               status:
 *                 type: string
 *                 enum: [not_delivered, delivered]
 *               description:
 *                 type: string
 *                 nullable: true
	*               disciplineId:
	*                 type: integer
	*                 example: 1
 *               startDate:
 *                 type: number
 *               endDate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *       400:
 *         description: Estrutura inválida
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.put("/activities/:id", AuthMiddleware, SchemaParserMiddleware(ActivityController.activitySchema), ActivityController.update)

/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Remover atividade
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade removida com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Atividade não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.delete("/activities/:id", AuthMiddleware, ActivityController.destroy)

module.exports = Router
