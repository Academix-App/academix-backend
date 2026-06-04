const Router = require('express').Router()

const VerificationController = require('../controllers/verification.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /verifications:
 *   get:
 *     summary: Listar histórico de verificações da conta autenticada
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico obtido com sucesso
 *       401:
 *         description: Não autorizado
 */
Router.get("/verifications", AuthMiddleware, VerificationController.index.bind(VerificationController))

/**
 * @swagger
 * /verifications/{id}:
 *   get:
 *     summary: Obter verificação por ID
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da verificação
 *     responses:
 *       200:
 *         description: Verificação obtida com sucesso
 *       404:
 *         description: Verificação não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.get("/verifications/:id", AuthMiddleware, VerificationController.show.bind(VerificationController))

/**
 * @swagger
 * /verifications:
 *   post:
 *     summary: Realizar nova verificação de veracidade
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - input
 *             properties:
 *               input:
 *                 type: string
 *                 example: "A terra é plana."
 *     responses:
 *       201:
 *         description: Verificação realizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
Router.post("/verifications", AuthMiddleware, SchemaParserMiddleware(VerificationController.verificationCreateSchema), VerificationController.create.bind(VerificationController))

/**
 * @swagger
 * /verifications/{id}:
 *   delete:
 *     summary: Deletar verificação
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da verificação
 *     responses:
 *       200:
 *         description: Verificação deletada com sucesso
 *       404:
 *         description: Verificação não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.delete("/verifications/:id", AuthMiddleware, VerificationController.delete.bind(VerificationController))

module.exports = Router