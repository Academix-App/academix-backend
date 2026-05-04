const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

const AccountService = require('./account.service')

class AuthService {
    /**
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        const account = await AccountService.findAccountByEmail(email)
        if (account?.error) return {
            error: true,
            message: "Não foi possível encontrar uma conta cadastrada com o endereço de e-mail informado.",
            id: "email_not_exists"
        }

        const isPasswordValid = await bcrypt.compare(password, account.password)
        if (!isPasswordValid) return {
            error: true,
            message: "A senha informada está incorreta.",
            id: "wrong_password"
        }

        return {
            account: {
                id: account.id,
                email: account.email,
                name: account.name,
                phone: account.phone
            },
            token: this.#generateJwt(account)
        }
    }

    /**
     * @param {string} email 
     * @param {string} name 
     * @param {string} phone 
     * @param {string} password 
     */
    async register(email, name, phone, password) {
        const accountWithSameEmail = await AccountService.findAccountByEmail(email)
        if (!accountWithSameEmail?.error) return {
            error: true,
            message: "Já existe uma conta registrada com o e-mail informado.",
            id: "email_already_exists"
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const account = await AccountService.createAccount(email, name, phone, hash)
        if (account?.error) return account

        return {
            token: this.#generateJwt(account)
        }
    }

    /**
     * @param {string} token 
     */
    async decodeJwt(token) {
        return jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
            if (error) return undefined

            return decoded
        })
    }

    /**
     * @param {Object} account
     */
    #generateJwt(account) {
        const token = jwt.sign({
            sub: account.id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' })

        return token
    }
}

module.exports = new AuthService()
