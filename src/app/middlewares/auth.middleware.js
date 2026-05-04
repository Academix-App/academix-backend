const express = require('express')
const AuthService = require('../services/auth.service')
const AccountService = require('../services/account.service')

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
module.exports = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.includes("Bearer ")) return res.status(401).json({
        error: true,
        message: "Não autorizado.",
        error_id: "unauthorized"
    })

    const token = req.headers.authorization.replace('Bearer ', '')

    const decodedTokenData = await AuthService.decodeJwt(token)
    if (!decodedTokenData) return res.status(401).json({
        error: true,
        message: "Não autorizado.",
        error_id: "unauthorized"
    })

    const accountData = await AccountService.findAccountById(decodedTokenData.sub)
    if (accountData?.error) return res.status(401).json({
        error: true,
        message: "Não autorizado.",
        error_id: "unauthorized"
    })

    req.account = accountData.dataValues

    return next()
}
