const Sequelize = require("sequelize")
const database = require("../index")

/**
 * @typedef {Object} ContentAttributes
 * @property {number} id
 * @property {number} accountId
 * @property {string} content
 * @property {number} notifications
 * @property {number} createTimestamp
 * @property {number} lastNotificationTimestamp
 */

/**
 * @typedef {import('sequelize').Model<ContentAttributes>} ContentInstance
 */

/**
 * @type {import('sequelize').ModelStatic<ContentInstance>}
 */
const Contents = database.define('contents', {
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
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    notifications: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    createTimestamp: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: "create_timestamp"
    },
    lastNotificationTimestamp: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: "last_notification_timestamp"
    }
}, {
    timestamps: false,
    freezeTableName: true
})


module.exports = Contents