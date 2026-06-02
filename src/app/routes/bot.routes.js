const Router = require('express').Router()

const BotController = require('../controllers/bot.controller')
const PrivateAuthMiddleware = require('../middlewares/private.auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /bot/activities:
 *   post:
 *     summary: Criar uma nova atividade (Bot)
 *     tags: [Bot]
 *     description: Endpoint privado para o bot criar atividades. Apenas requisições localhost são permitidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - title
 *               - color
 *               - type
 *               - status
 *               - startDate
 *               - endDate
 *               - disciplineId
 *             properties:
 *               accountId:
 *                 type: integer
 *                 example: 1
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
 *         description: Não autorizado (acesso apenas localhost)
 */
Router.post(
    "/bot/activities",
    PrivateAuthMiddleware,
    SchemaParserMiddleware(BotController.activitySchema),
    BotController.createActivity.bind(BotController)
)

/**
 * @swagger
 * /bot/activities:
 *   get:
 *     summary: Listar atividades de uma conta (Bot)
 *     tags: [Bot]
 *     description: Endpoint privado para o bot listar atividades de uma conta. Apenas requisições localhost são permitidas.
 *     parameters:
 *       - in: query
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
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
 *         description: Não autorizado (acesso apenas localhost)
 *       400:
 *         description: AccountId é obrigatório
 */
Router.get(
    "/bot/activities",
    PrivateAuthMiddleware,
    SchemaParserMiddleware(null, BotController.activityQuerySchema),
    BotController.indexActivities.bind(BotController)
)

/**
 * @swagger
 * /bot/disciplines:
 *   get:
 *     summary: Listar disciplinas de uma conta (Bot)
 *     tags: [Bot]
 *     description: Endpoint privado para o bot listar disciplinas de uma conta. Apenas requisições localhost são permitidas.
 *     parameters:
 *       - in: query
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Disciplinas obtidas com sucesso
 *       401:
 *         description: Não autorizado (acesso apenas localhost)
 *       400:
 *         description: AccountId é obrigatório
 */
Router.get(
    "/bot/disciplines",
    PrivateAuthMiddleware,
    BotController.getDisciplines.bind(BotController)
)

/**
 * @swagger
 * /bot/disciplines:
 *   post:
 *     summary: Criar uma nova disciplina (Bot)
 *     tags: [Bot]
 *     description: Endpoint privado para o bot criar disciplinas. Apenas requisições localhost são permitidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - name
 *               - teacher
 *               - color
 *             properties:
 *               accountId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Matemática
 *               teacher:
 *                 type: string
 *                 example: João Silva
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *       400:
 *         description: Estrutura inválida
 *       401:
 *         description: Não autorizado (acesso apenas localhost)
 */
Router.post(
    "/bot/disciplines",
    PrivateAuthMiddleware,
    SchemaParserMiddleware(BotController.disciplineSchema),
    BotController.createDiscipline.bind(BotController)
)

module.exports = Router

