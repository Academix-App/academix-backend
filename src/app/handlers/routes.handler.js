const fs = require('fs')

module.exports = async (app) => {
    const routes = fs.readdirSync(`./src/app/routes/`)
    if (!routes || routes.length === 0) return

    routes.reverse().forEach((r) => {
        let Router = require("../routes/" + r)
        app.use('/', Router)
    })
}
