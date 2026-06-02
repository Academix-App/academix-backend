const Accounts = require("../database/models/account")

class AccountRepository {
    /**
     * @param {number} id 
     */
    async findById(id) {
        const account = await Accounts.findOne({
            where: {
                id
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!account) return {
            error: true,
            message: "Não foi possível encontrar uma conta com o identificador informado.",
            id: "account_not_found"
        }

        return account
    }

    /**
     * @param {string} email 
     */
    async findByEmail(email) {
        const account = await Accounts.findOne({
            where: {
                email
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!account) return {
            error: true,
            message: "Não foi possível encontrar uma conta com o e-mail informado.",
            id: "account_not_found"
        }

        return account
    }

    /**
     * @param {string} phone 
     */
    async findByPhone(phone) {
        const account = await Accounts.findOne({
            where: {
                phone
            }
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!account) return {
            error: true,
            message: "Não foi possível encontrar uma conta com o telefone informado.",
            id: "account_not_found"
        }

        return account
    }

    /**
     * @param {string} email 
     * @param {string} name
     * @param {string} phone
     * @param {string} password 
     */
    async create(email, name, phone, password) {
        const account = await Accounts.create({
            email,
            name,
            phone,
            password
        }).catch((e) => {
            console.log(e)

            return undefined
        })

        if (!account) return {
            error: true,
            message: "Não foi possível efetuar a criação da conta.",
            id: "internal_server_error"
        }

        return account
    }

    async update(id, name, phone) {
        const updateAccount = await Accounts.update(
            {
                name,
                phone
            },
            {
                where: { id }
            }
        ).catch(() => undefined)

        if (!updateAccount) return {
            error: true,
            message: "Não foi possível atualizar a conta.",
            id: "internal_server_error"
        }

        return true
    }
}

module.exports = new AccountRepository()
