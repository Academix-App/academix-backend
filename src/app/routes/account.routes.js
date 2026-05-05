const Router = require('express').Router()

const AccountController = require('../controllers/account.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const privateAuthMiddleware = require('../middlewares/private.auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /accounts/@me:
 *   get:
 *     summary: Obter dados da conta autenticada
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados da conta obtidos com sucesso
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
 *         description: Não autorizado
 */
Router.get("/accounts/@me", AuthMiddleware, AccountController.index)

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Obter conta por ID
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Dados da conta obtidos com sucesso
 *       404:
 *         description: Conta não encontrada
 */
Router.get("/accounts/:id", privateAuthMiddleware, AccountController.show)

/**
 * @swagger
 * /accounts/{phone}/phone:
 *   get:
 *     summary: Obter conta por telefone
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de telefone da conta
 *     responses:
 *       200:
 *         description: Dados da conta obtidos com sucesso
 *       404:
 *         description: Conta não encontrada
 */
Router.get("/accounts/:phone/phone", privateAuthMiddleware, AccountController.showByPhone)

/**
 * @swagger
 * /accounts/@me:
 *   put:
 *     summary: Atualizar dados da conta autenticada
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       200:
 *         description: Conta atualizada com sucesso
 *       401:
 *         description: Não autorizado
 */
Router.put("/accounts/@me", AuthMiddleware, SchemaParserMiddleware(AccountController.accountUpdateSchema), AccountController.update)

module.exports = Router
