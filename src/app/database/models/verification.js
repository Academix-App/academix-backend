const Sequelize = require("sequelize")

const database = require("../index")

/**
 * @typedef {Object} VerificationAttributes
 * @property {number} id
 * @property {number} accountId
 * @property {string} input
 * @property {number} percentage
 * @property {string} justification
 * @property {number} createdAt
 */

/**
 * @typedef {import('sequelize').Model<VerificationAttributes>} VerificationInstance
 */

/**
 * @type {import('sequelize').ModelStatic<VerificationInstance>}
 */
const Verifications = database.define('verifications', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "account_id"
    },
    input: {
        type: Sequelize.TEXT('long'),
        allowNull: true
    },
    percentage: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    justification: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    createdAt: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: "created_at"
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Verifications