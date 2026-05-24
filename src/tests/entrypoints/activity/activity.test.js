const request = require("supertest");
const { getAuthToken } = require("../../utils/account.util");

let token;
let createdActivityId;

beforeAll(async () => {
    token = await getAuthToken();
});

const validActivity = {
    disciplineId: 2,
    title: "Prova de Cálculo",
    color: "#FF5733",
    type: "EXAM",
    status: "not_delivered",
    description: null,
    startDate: 1700000000000,
    endDate: 1700003600000
};

describe("POST /activities", () => {
    describe("Error cases", () => {
        test("Should return 401 when creating activity without authentication", async () => {
            const response = await request(app)
                .post("/activities")
                .send(validActivity);

            expect(response.status).toBe(401);
        });

        test("Should return 400 when title is missing", async () => {
            const { title, ...body } = validActivity;

            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when color is missing", async () => {
            const { color, ...body } = validActivity;

            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when color is invalid (no #)", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, color: "FF5733" });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when color has more than 7 characters", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, color: "#FF57331" });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when type is invalid", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, type: "INVALID_TYPE" });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when status is invalid", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, status: "invalid_status" });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when endDate is before startDate", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, endDate: 1699999999999 });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when title exceeds 128 characters", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, title: "a".repeat(129) });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });

        test("Should return 400 when description exceeds 128 characters", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validActivity, description: "a".repeat(129) });

            expect(response.status).toBe(400);
            expect(response.body.id).toBe("invalid_schema");
        });
    });

    describe("Success cases", () => {
        test("Should create activity with all valid fields", async () => {
            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send(validActivity);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                error: false,
                message: "Atividade criada com sucesso.",
                data: {
                    disciplineId: validActivity.disciplineId,
                    title: validActivity.title,
                    color: validActivity.color,
                    type: validActivity.type,
                    status: validActivity.status,
                    description: null,
                    startDate: validActivity.startDate,
                    endDate: validActivity.endDate
                }
            });

            createdActivityId = response.body.data.id;
        });

        test("Should create activity with description omitted (null)", async () => {
            const { description, ...body } = validActivity;

            const response = await request(app)
                .post("/activities")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...body, title: "Apresentação de TCC" });

            expect(response.status).toBe(201);
            expect(response.body.data.description).toBeNull();
        });
    });
});

describe("GET /activities", () => {
    test("Should return 401 when listing activities without authentication", async () => {
        const response = await request(app)
            .get("/activities");

        expect(response.status).toBe(401);
    });

    test("Should list all activities of the authenticated user", async () => {
        const response = await request(app)
            .get("/activities")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Atividades obtidas com sucesso."
        });
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    test("Should filter activities by startDate", async () => {
        const response = await request(app)
            .get("/activities")
            .query({ startDate: 1700000000000 })
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        response.body.data.forEach(activity => {
            expect(Number(activity.startDate)).toBeGreaterThanOrEqual(1700000000000);
        });
    });

    test("Should filter activities by endDate", async () => {
        const response = await request(app)
            .get("/activities")
            .query({ endDate: 1700003600000 })
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        response.body.data.forEach(activity => {
            expect(Number(activity.endDate)).toBeLessThanOrEqual(1700003600000);
        });
    });

    test("Should filter activities by startDate and endDate", async () => {
        const response = await request(app)
            .get("/activities")
            .query({ startDate: 1700000000000, endDate: 1700003600000 })
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("Should return empty array when filter matches no activities", async () => {
        const response = await request(app)
            .get("/activities")
            .query({ startDate: 9999999999999 })
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });
});

describe("GET /activities/:id", () => {
    test("Should return 401 when fetching activity without authentication", async () => {
        const response = await request(app)
            .get(`/activities/${createdActivityId}`);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when activity does not exist", async () => {
        const response = await request(app)
            .get("/activities/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("activity_not_found");
    });

    test("Should return activity by ID", async () => {
        const response = await request(app)
            .get(`/activities/${createdActivityId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Atividade obtida com sucesso.",
            data: {
                id: createdActivityId,
                title: validActivity.title
            }
        });
    });
});

describe("PUT /activities/:id", () => {
    test("Should return 401 when updating activity without authentication", async () => {
        const response = await request(app)
            .put(`/activities/${createdActivityId}`)
            .send(validActivity);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when updating non-existent activity", async () => {
        const response = await request(app)
            .put("/activities/999999")
            .set("Authorization", `Bearer ${token}`)
            .send(validActivity);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("activity_not_found");
    });

    test("Should return 400 when updating with invalid data", async () => {
        const response = await request(app)
            .put(`/activities/${createdActivityId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ ...validActivity, type: "INVALID" });

        expect(response.status).toBe(400);
        expect(response.body.id).toBe("invalid_schema");
    });

    test("Should update activity with valid data", async () => {
        const updatedData = {
            ...validActivity,
            title: "Prova de Álgebra",
            status: "delivered"
        };

        const response = await request(app)
            .put(`/activities/${createdActivityId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Atividade atualizada com sucesso."
        });
        expect(response.body.data.title).toBe("Prova de Álgebra");
        expect(response.body.data.status).toBe("delivered");
    });
});

describe("DELETE /activities/:id", () => {
    test("Should return 401 when deleting activity without authentication", async () => {
        const response = await request(app)
            .delete(`/activities/${createdActivityId}`);

        expect(response.status).toBe(401);
    });

    test("Should return 404 when deleting non-existent activity", async () => {
        const response = await request(app)
            .delete("/activities/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("activity_not_found");
    });

    test("Should delete activity successfully", async () => {
        const response = await request(app)
            .delete(`/activities/${createdActivityId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            error: false,
            message: "Atividade removida com sucesso.",
            data: {}
        });
    });

    test("Should return 404 when fetching deleted activity", async () => {
        const response = await request(app)
            .get(`/activities/${createdActivityId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.id).toBe("activity_not_found");
    });
});
