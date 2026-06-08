const Sequelize = require("sequelize")
const database = require("../index")

/**
 * @typedef {Object} ContentSummaryAttributes
 * @property {number} id
 * @property {number} contentId
 * @property {string} summary
 * @property {number} createdAt
 */

/**
 * @typedef {import('sequelize').Model<ContentSummaryAttributes>} ContentSummaryInstance
 */

/**
 * @type {import('sequelize').ModelStatic<ContentSummaryInstance>}
 */
const ContentSummaries = database.define('content_summaries', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    contentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "content_id"
    },
    summary: {
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


module.exports = ContentSummaries