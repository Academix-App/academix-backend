const Sequelize = require("sequelize")

const database = require("../index")

/**
 * @typedef {Object} DisciplineAttributes
 * @property {number} id
 * @property {number} accountId
 * @property {string} name
 * @property {string} teacher
 * @property {string} color
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {import('sequelize').Model<DisciplineAttributes>} DisciplineInstance
 */

/**
 * @type {import('sequelize').ModelStatic<DisciplineInstance>}
 */
const Disciplines = database.define('disciplines', {
    id: {
        type: Sequelize.INTEGER,
        Allownull: true,
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        Allownull: true,
        field: "account_id"
    },
    name: {
        type: Sequelize.STRING(128),
        Allownull: true
    },
    teacher: {
        type: Sequelize.STRING(128),
        Allownull: true
    },
    color: {
        type: Sequelize.STRING(7),
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

module.exports = Disciplines
