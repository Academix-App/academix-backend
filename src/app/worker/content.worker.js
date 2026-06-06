const SummaryAiCommunication = require("../ai/summaryAiCommunication")
const ContentRepository = require("../repositories/content.repository")
const ContentSummaryRepository = require("../repositories/contentSummary.repository")

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = async (io) => {
    const contents = await ContentRepository.findAll()

    if (contents?.error) {
        console.log("[WORKER-CONTENT] Erro ao obter conteúdos do banco de dados.")
        await sleep(1000 * 30)
        return module.exports(io)
    }

    for (const content of contents) {
        const intervalReached = Date.now() >= content.lastNotificationTimestamp + (
            content.notifications === 0 ? 0 : (1000 * 60 * 60 * 24 * (2 ** content.notifications))
        )

        if (content.notifications < 6 && intervalReached) {
            const result = await SummaryAiCommunication.generate(content.content)

            if (!result?.error) {
                await ContentSummaryRepository.create(content.id, result.summary)
                await ContentRepository.updateNotification(content.id, content.notifications + 1, Date.now())
                
                // ✅ Emite só para o account dono do content
                io.to(`account:${content.accountId}`).emit("summary", {
                    contentId: content.id,
                    summary: result.summary
                })
            }
        }
    }

    await sleep(1000 * 60)
    return module.exports(io)
}