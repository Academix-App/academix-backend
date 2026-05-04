const request = require("supertest");

async function getAuthToken() {
    const user = {
        email: "joao.silva@example.com",
        password: "Senha123"
    };

    const response = await request(global.app)
        .post("/login")
        .send(user);
    return response.body.data.token;
}

module.exports = {
    getAuthToken
};
