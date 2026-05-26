const Router = require('express').Router()

const DisciplineController = require('../controllers/discipline.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

/**
 * @swagger
 * /disciplines:
 *   post:
 *     summary: Criar uma nova disciplina
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - professor
 *               - color
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Matemática
 *               professor:
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
 *         description: Não autorizado
 */
Router.post("/disciplines", AuthMiddleware, SchemaParserMiddleware(DisciplineController.disciplineSchema), DisciplineController.create)

/**
 * @swagger
 * /disciplines:
 *   get:
 *     summary: Listar disciplinas do usuário autenticado
 *     tags: [Discipline]
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
 *     responses:
 *       200:
 *         description: Disciplinas obtidas com sucesso
 *       401:
 *         description: Não autorizado
 */
Router.get("/disciplines", AuthMiddleware, DisciplineController.index)

/**
 * @swagger
 * /disciplines/{id}:
 *   get:
 *     summary: Buscar disciplina por ID
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina obtida com sucesso
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.get("/disciplines/:id", AuthMiddleware, DisciplineController.show)

/**
 * @swagger
 * /disciplines/{id}:
 *   put:
 *     summary: Atualizar disciplina
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - professor
 *               - color
 *             properties:
 *               nome:
 *                 type: string
 *               professor:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
 *       400:
 *         description: Estrutura inválida
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.put("/disciplines/:id", AuthMiddleware, SchemaParserMiddleware(DisciplineController.disciplineSchema), DisciplineController.update)

/**
 * @swagger
 * /disciplines/{id}:
 *   delete:
 *     summary: Remover disciplina
 *     tags: [Discipline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina removida com sucesso
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 */
Router.delete("/disciplines/:id", AuthMiddleware, DisciplineController.destroy)

module.exports = Router
