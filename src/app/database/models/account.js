const Sequelize = require("sequelize")

const database = require("../index")

/**
 * @typedef {Object} AccountAttributes
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} phone
 * @property {string} password
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {import('sequelize').Model<AccountAttributes>} AccountInstance
 */

/**
 * @type {import('sequelize').ModelStatic<AccountInstance>}
 */
const Accounts = database.define('accounts', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "updated_at"
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Accounts
