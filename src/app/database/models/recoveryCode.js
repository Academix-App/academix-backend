const Sequelize = require("sequelize")

const database = require("../index")
const Accounts = require("./account")

/**
 * @typedef {Object} RecoveryCodeAttributes
 * @property {number} id
 * @property {number} accountId
 * @property {string} code
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {import('sequelize').Model<RecoveryCodeAttributes>} RecoveryCodeInstance
 */

/**
 * @type {import('sequelize').ModelStatic<RecoveryCodeInstance>}
 */
const RecoveryCodes = database.define('recovery_codes', {
    id: {
        type: Sequelize.INTEGER,
        Allownull: true,
        primaryKey: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        Allownull: true,
        field: "account_id"
    },
    code: {
        type: Sequelize.STRING,
        Allownull: true
    },
    createdAt: {
        type: Sequelize.BIGINT,
        Allownull: true,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.BIGINT,
        Allownull: true,
        field: "updated_at"
    }
}, {
    timestamps: false,
    freezeTableName: true
})

RecoveryCodes.belongsTo(Accounts, {
  as: "account",
  foreignKey: "accountId",
})

module.exports = RecoveryCodes
