const Sequelize = require("sequelize")

const database = require("../index")

const AiVerification = database.define('ai_verifications', {
    id: {
        type: Sequelize.INTEGER,
        Allownull: true,
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        Allownull: false,
        field: "account_id"
    },
    content: {
        type: Sequelize.TEXT("long"),
        Allownull: false
    },
    score: {
        type: Sequelize.DECIMAL(5, 2),
        Allownull: false
    },
    feedback: {
        type: Sequelize.TEXT("long"),
        Allownull: false
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

module.exports = AiVerification