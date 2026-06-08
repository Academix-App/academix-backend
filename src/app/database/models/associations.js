const Contents = require("./contents")
const ContentSummaries = require("./contentsSummaries")

Contents.hasMany(ContentSummaries, { foreignKey: "content_id", as: "summaries" })
ContentSummaries.belongsTo(Contents, { foreignKey: "content_id" })