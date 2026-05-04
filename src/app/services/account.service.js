const AccountRepository = require("../repositories/account.repository")

class AccountService {
    /**
     * @param {number} id 
     */
    async findAccountById(id) {
        return await AccountRepository.findById(id)
    }

    /**
     * @param {string} email 
     */
    async findAccountByEmail(email) {
        return await AccountRepository.findByEmail(email)
    }

    /**
     * @param {string} phone 
     */
    async findAccountByPhone(phone) {
        return await AccountRepository.findByPhone(phone)
    }

    /**
     * @param {string} email 
     * @param {string} name
     * @param {string} phone
     * @param {string} password
     */
    async createAccount(email, name, phone, password) {
        return await AccountRepository.create(email, name, phone, password)
    }

    /**
     * @param {number} id 
     * @param {string} name 
     * @param {string} phone 
     */
    async updateAccount(id, name, phone) {
        return await AccountRepository.update(id, name, phone)
    }
}

module.exports = new AccountService()
