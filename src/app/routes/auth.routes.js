const Router = require('express').Router()

const AuthController = require('../controllers/auth.controller')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

Router.post("/login", SchemaParserMiddleware(AuthController.loginSchema), AuthController.login)
Router.post("/register", SchemaParserMiddleware(AuthController.registerSchema), AuthController.register)

module.exports = Router
