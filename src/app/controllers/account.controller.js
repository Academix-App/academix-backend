const express = require('express')
const AccountService = require('../services/account.service')
const zod = require('zod')

class AccountController {
    constructor() {
        this.accountUpdateSchema = zod.object({
            name: zod
                .string({
                    required_error: "O nome é obrigatório",
                    invalid_type_error: "O nome deve ser um texto válido"
                })
                .min(3, "O nome deve ter pelo menos 3 caracteres.")
                .regex(
                    /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+){1,}$/,
                    "O nome deve conter apenas letras e espaços válidos."),
            phone: zod
                .string({
                    required_error: "O telefone é obrigatório",
                    invalid_type_error: "O telefone deve ser um texto numérico sem máscara"
                })
                .regex(/^\d+$/, "O telefone deve conter apenas números.")
                .min(8, "O telefone deve ter no mínimo 8 dígitos.")
                .max(15, "O telefone deve ter no máximo 15 dígitos.")
        }, { message: "Foi fornecida uma estrutura inválida para a atualização." })
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async index(req, res) {
        delete req.account.password
        delete req.account.createdAt
        delete req.account.updatedAt

        return res.status(200).json({
            error: false,
            message: "Dados da conta obtidos com sucesso.",
            data: req.account
        })
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async show(req, res) {
        const { id } = req.params

        const account = await AccountService.findAccountById(id)
        if (account?.error) return res.status(404).json(account)

        delete account.dataValues.password

        return res.status(200).json({
            error: false,
            message: "Dados da conta obtidos com sucesso.",
            data: account
        })
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async showByPhone(req, res) {
        const { phone } = req.params

        const account = await AccountService.findAccountByPhone(phone)
        if (account?.error) return res.status(404).json(account)

        delete account.dataValues.password

        return res.status(200).json({
            error: false,
            message: "Dados da conta obtidos com sucesso.",
            data: account
        })
    }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async update(req, res) {
        const { name, phone } = req.body

        const updatedAccount = await AccountService.updateAccount(req.account.id, name, phone)
        if (updatedAccount?.error) return res.status(500).json(updatedAccount)

        return res.json({
            error: false,
            message: "Conta atualizada com sucesso.",
            data: {}
        })
    }
}

module.exports = new AccountController()
