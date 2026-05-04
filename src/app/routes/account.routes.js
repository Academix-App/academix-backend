const Router = require('express').Router()

const AccountController = require('../controllers/account.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')
const privateAuthMiddleware = require('../middlewares/private.auth.middleware')
const SchemaParserMiddleware = require('../middlewares/schema.middleware')

Router.get("/accounts/@me", AuthMiddleware, AccountController.index)
Router.get("/accounts/:id", privateAuthMiddleware, AccountController.show)
Router.get("/accounts/:phone/phone", privateAuthMiddleware, AccountController.showByPhone)

Router.put("/accounts/@me", AuthMiddleware, SchemaParserMiddleware(AccountController.accountUpdateSchema), AccountController.update)

module.exports = Router
