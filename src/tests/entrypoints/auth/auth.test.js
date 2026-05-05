const request = require("supertest");

describe("POST /register", () => {
    describe("Error cases", () => {
        test("Should return an error when phone field is missing", async () => {
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

        test("Should return an error when name field is missing", async () => {
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

        test("Should return an error when email field is missing", async () => {
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

    describe("Success cases", () => {
        test("Should register a new user with valid data", async () => {
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
    describe("Error cases", () => {
        test("Should return an error when logging in with invalid credentials", async () => {
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

    describe("Success cases", () => {
        test("Should login successfully with valid credentials", async () => {
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
