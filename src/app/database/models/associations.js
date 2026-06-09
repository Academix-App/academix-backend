const Contents = require("./contents")
const ContentSummaries = require("./contentsSummaries")
const ContentChats = require("./contentChat")

Contents.hasMany(ContentSummaries, { foreignKey: "content_id", as: "summaries" })
ContentSummaries.belongsTo(Contents, { foreignKey: "content_id" })

Contents.hasMany(ContentChats, { foreignKey: "content_id", as: "chats" })
ContentChats.belongsTo(Contents, { foreignKey: "content_id" })