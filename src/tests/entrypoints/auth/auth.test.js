const request = require("supertest");

describe("POST /register", () => {
    describe("Casos de erro", () => {
        test("Deve gerar um erro pela falta do campo phone", async () => {
            const newUser = {
                name: "Maria Oliveira",
                email: "maria.oliveira@example.com",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/register")
                .send(newUser);

            expect(response.status).toBe(400);
        });

        test("Deve gerar um erro pela falta do campo name", async () => {
            const newUser = {
                email: "maria.oliveira@example.com",
                phone: "11987654321",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/register")
                .send(newUser);

            expect(response.status).toBe(400);
        });

        test("Deve gerar um erro pela falta do campo email", async () => {
            const newUser = {
                name: "Maria Oliveira",
                phone: "11987654321",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/register")
                .send(newUser);

            expect(response.status).toBe(400);
        });
    });

    describe("Casos de sucesso", () => {
        test("Deve registrar um novo usuário com dados válidos", async () => {
            const newUser = {
                name: "João Silva",
                email: "joao.silva@example.com",
                phone: "11987654321",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/register")
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                error: false,
                message: "Usuário registrado com sucesso",
                data: {
                    token: expect.any(String)
                }
            });
            expect(response.body.data.token).toBeTruthy();
        });
    });
});

describe("POST /login", () => {
    describe("Casos de erro", () => {
        test("Deve gerar um erro ao tentar realizar o login com dados inválidos", async () => {
            const payload = {
                email: "invalid.email@example.com",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/login")
                .send(payload);

            expect(response.status).toBe(401);
        });
    });

    describe("Casos de sucesso", () => {
        test("Deve tentar realizar o login com dados válidos", async () => {
            const payload = {
                email: "joao.silva@example.com",
                password: "Senha123"
            };

            const response = await request(app)
                .post("/login")
                .send(payload);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                error: false,
                message: "Login realizado com sucesso",
                data: {
                    token: expect.any(String)
                }
            });
            expect(response.body.data.token).toBeTruthy();
        });
    });
});
