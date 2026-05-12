const Sequelize = require("sequelize")

const database = require("../index")

/**
 * @typedef {Object} ActivityAttributes
 * @property {number} id
 * @property {number} accountId
 * @property {string} title
 * @property {string} color
 * @property {string} type
 * @property {string} status
 * @property {string|null} description
 * @property {number} startDate
 * @property {number} endDate
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {import('sequelize').Model<ActivityAttributes>} ActivityInstance
 */

/**
 * @type {import('sequelize').ModelStatic<ActivityInstance>}
 */
const Activities = database.define('activities', {
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
    title: {
        type: Sequelize.STRING(128),
        Allownull: true
    },
    color: {
        type: Sequelize.STRING(7),
        Allownull: true
    },
    type: {
        type: Sequelize.ENUM('EXAM', 'PRESENTATION', 'ASSIGNMENT', 'OTHER'),
        Allownull: true
    },
    status: {
        type: Sequelize.ENUM('not_delivered', 'delivered'),
        Allownull: true
    },
    description: {
        type: Sequelize.STRING(128),
        allowNull: true
    },
    startDate: {
        type: Sequelize.BIGINT,
        Allownull: true,
        field: "start_date"
    },
    endDate: {
        type: Sequelize.BIGINT,
        Allownull: true,
        field: "end_date"
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

module.exports = Activities
