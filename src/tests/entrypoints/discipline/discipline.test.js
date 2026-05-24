const request = require("supertest");
const { getAuthToken } = require("../../utils/account.util");

let token;
let createdDisciplineId;

beforeAll(async () => {
    token = await getAuthToken();
});

const validDiscipline = {
   name: "Matemática",
   teacher: "Prof. João"
};

describe("POST /disciplines", () => {
    describe("Error cases", () => {
        test("Should return 401 when creating discipline without authentication", async () => {
            const response = await request(app)
                .post("/disciplines")
                .send(validDiscipline);

            expect(response.status).toBe(401);
        });

        test("Should return 400 when name is missing", async () => {
            const { name, ...body } = validDiscipline;

            const response = await request(app)
                .post("/disciplines")
                .set("Authorization", `Bearer ${token}`)
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when teacher is missing", async () => {
            const { teacher, ...body } = validDiscipline;

            const response = await request(app)
                .post("/disciplines")
                .set("Authorization", `Bearer ${token}`)
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });
    });

    describe("Success cases", () => {
        test("Should create discipline with all valid fields", async () => {
            const response = await request(app)
                .post("/disciplines")
                .set("Authorization", `Bearer ${token}`)
                .send(validDiscipline);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                error: false,
                message: "Disciplina criada com sucesso.",
                data: {
                    name: validDiscipline.name,
                    teacher: validDiscipline.teacher
                }
            });

            createdDisciplineId = response.body.data.id;
        });

        test("Should create discipline with all valid fields (2)", async () => {
            const response = await request(app)
                .post("/disciplines")
                .set("Authorization", `Bearer ${token}`)
                .send(validDiscipline);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                error: false,
                message: "Disciplina criada com sucesso.",
                data: {
                    name: validDiscipline.name,
                    teacher: validDiscipline.teacher
                }
            });
        });
    });
});

describe("GET /disciplines", () => {
    test("Should return 401 when listing disciplines without authentication", async () => {
        const response = await request(app)
            .get("/disciplines");

        expect(response.status).toBe(401);
    });

    test("Should list all disciplines of the authenticated user", async () => {
        const response = await request(app)
            .get("/disciplines")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Disciplinas obtidas com sucesso."
        });
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
});

describe("GET /disciplines/:id", () => {
    test("Should return 401 when fetching discipline without authentication", async () => {
        const response = await request(app)
            .get(`/disciplines/${createdDisciplineId}`);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when discipline does not exist", async () => {
        const response = await request(app)
            .get("/disciplines/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("discipline_not_found");
    });

    test("Should return discipline by ID", async () => {
        const response = await request(app)
            .get(`/disciplines/${createdDisciplineId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Disciplina obtida com sucesso.",
            data: {
                id: createdDisciplineId,
                name: validDiscipline.name,
                teacher: validDiscipline.teacher
            }
        });
    });
});

describe("PUT /disciplines/:id", () => {
    test("Should return 401 when updating discipline without authentication", async () => {
        const response = await request(app)
            .put(`/disciplines/${createdDisciplineId}`)
            .send(validDiscipline);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when updating non-existent discipline", async () => {
        const response = await request(app)
            .put("/disciplines/999999")
            .set("Authorization", `Bearer ${token}`)
            .send(validDiscipline);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("discipline_not_found");
    });

    test("Should return 400 when updating with invalid data", async () => {
        const response = await request(app)
            .put(`/disciplines/${createdDisciplineId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ ...validDiscipline, name: "" });

        expect(response.status).toBe(400);
        expect(response.body.id).toBe("invalid_schema");
    });

    test("Should update discipline with valid data", async () => {
        const updatedData = {
            ...validDiscipline,
            name: "Álgebra Linear",
            teacher: "João Silva"
        };

        const response = await request(app)
            .put(`/disciplines/${createdDisciplineId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Disciplina atualizada com sucesso."
        });
        expect(response.body.data.name).toBe("Álgebra Linear");
        expect(response.body.data.teacher).toBe("João Silva");
    });
});

describe("DELETE /disciplines/:id", () => {
    test("Should return 401 when deleting discipline without authentication", async () => {
        const response = await request(app)
            .delete(`/disciplines/${createdDisciplineId}`);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when deleting non-existent discipline", async () => {
        const response = await request(app)
            .delete("/disciplines/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("discipline_not_found");
    });

    test("Should delete discipline successfully", async () => {
        const response = await request(app)
            .delete(`/disciplines/${createdDisciplineId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Disciplina removida com sucesso.",
            data: {}
        });
    });

    test("Should return 404 when fetching deleted discipline", async () => {
        const response = await request(app)
            .get(`/disciplines/${createdDisciplineId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("discipline_not_found");
    });
});
