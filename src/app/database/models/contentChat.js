const Sequelize = require("sequelize")
const database = require("../index")

/**
 * @typedef {Object} ContentChatAttributes
 * @property {number} id
 * @property {number} contentId
 * @property {number} accountId
 * @property {'user'|'assistant'} role
 * @property {string} message
 * @property {number} createdAt
 */

/**
 * @typedef {import('sequelize').Model<ContentChatAttributes>} ContentChatInstance
 */

/**
 * @type {import('sequelize').ModelStatic<ContentChatInstance>}
 */
const ContentChats = database.define('content_chats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    contentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "content_id"
    },
    accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "account_id"
    },
    role: {
        type: Sequelize.ENUM('user', 'assistant'),
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
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

module.exports = ContentChats