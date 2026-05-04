const express = require('express')
const zod = require('zod')

const AuthService = require('../services/auth.service')
class AuthController {
    constructor() {
        this.loginSchema = zod.object({
            email: zod.string({
                required_error: "O campo e-mail é obrigatório",
                invalid_type_error: "O e-mail deve ser um texto válido"
            }).email("Formato de e-mail inválido"),
            password: zod
                .string({
                    required_error: "A senha é obrigatória",
                    invalid_type_error: "A senha deve ser um texto válido"
                })
        }, "Foi fornecida uma estrutura inválida para o login.")

        this.registerSchema = zod.object({
            name: zod
                .string({
                    required_error: "O nome é obrigatório",
                    invalid_type_error: "O nome deve ser um texto válido"
                })
                .min(3, "O nome deve ter pelo menos 3 caracteres.")
                .regex(
                    /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+){1,}$/,
                    "O nome deve conter apenas letras e espaços válidos."),
            email: zod
                .string({
                    required_error: "O campo e-mail é obrigatório",
                    invalid_type_error: "O e-mail deve ser um texto válido"
                })
                .email("Formato de e-mail inválido"),
            password: zod
                .string({
                    required_error: "A senha é obrigatória",
                    invalid_type_error: "A senha deve ser um texto válido"
                })
                .min(8, "A senha deve ter no mínimo 8 caracteres.")
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    "A senha deve conter letras maiúsculas, minúsculas e números."
                ),
            phone: zod
                .string({
                    required_error: "O telefone é obrigatório",
                    invalid_type_error: "O telefone deve ser um texto numérico sem máscara"
                })
                .regex(/^\d+$/, "O telefone deve conter apenas números.")
                .min(8, "O telefone deve ter no mínimo 8 dígitos.")
                .max(15, "O telefone deve ter no máximo 15 dígitos.")
        }, { message: "Foi fornecida uma estrutura inválida para o registro." })
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async login(req, res) {
        const { email, password } = req.body

        const login = await AuthService.login(email, password)
        if (login?.error) return res.status(401).json({
            error: true,
            message: login.message || "Não foi possível realizar o login",
            id: login.id || "bad_request"
        })

        return res.status(200).json({
            error: false,
            message: "Login realizado com sucesso",
            data: login
        })
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async register(req, res) {
        const { name, email, phone, password } = req.body

        const createAccount = await AuthService.register(email, name, phone, password)
        if (createAccount?.error) return res.status(400).json({
            error: true,
            message: createAccount.message || "Não foi possível registrar o usuário",
            id: createAccount.id || "bad_request"
        })

        return res.status(201).json({
            error: false,
            message: "Usuário registrado com sucesso",
            data: {
                token: createAccount.token,
            }
        })
    }
}

module.exports = new AuthController()
