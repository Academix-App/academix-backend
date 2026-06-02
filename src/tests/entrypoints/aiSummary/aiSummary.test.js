const request = require("supertest");
const { getAuthToken } = require("../../utils/account.util");

let token;
let createdSummaryId;

beforeAll(async () => {
    token = await getAuthToken();
});

const validSummaryContent = {
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
};

describe("POST /ai-summaries", () => {
    describe("Error cases", () => {
        test("Should return 401 when creating summary without authentication", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .send(validSummaryContent);

            expect(response.status).toBe(401);
        });

        test("Should return 400 when content is missing", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(response.status).toBe(400);
        });

        test("Should return 400 when content is empty", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", `Bearer ${token}`)
                .send({ content: "" });

            expect(response.status).toBe(400);
        });

        test("Should return 400 when content has less than 10 characters", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", `Bearer ${token}`)
                .send({ content: "Muito curto" });

            expect(response.status).toBe(400);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", "Bearer invalid.token.here")
                .send(validSummaryContent);

            expect(response.status).toBe(401);
        });
    });

    describe("Success cases", () => {
        test("Should create summary with valid content", async () => {
            const response = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", `Bearer ${token}`)
                .send(validSummaryContent);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                error: false,
                message: "Resumo gerado com sucesso.",
                data: expect.objectContaining({
                    id: expect.any(Number),
                    summary: expect.any(String)
                })
            });

            expect(response.body.data.summary.length).toBeGreaterThan(0);
            createdSummaryId = response.body.data.id;
        });
    });
});

describe("GET /ai-summaries", () => {
    describe("Error cases", () => {
        test("Should return 401 when listing summaries without authentication", async () => {
            const response = await request(global.app)
                .get("/ai-summaries");

            expect(response.status).toBe(401);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .get("/ai-summaries")
                .set("Authorization", "Bearer invalid.token.here");

            expect(response.status).toBe(401);
        });
    });

    describe("Success cases", () => {
        test("Should return array of summaries for authenticated user", async () => {
            const response = await request(global.app)
                .get("/ai-summaries")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                error: false,
                message: "Resumos listados com sucesso.",
                data: expect.any(Array)
            });
        });

        test("Should have correct data structure in summaries list", async () => {
            const response = await request(global.app)
                .get("/ai-summaries")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            
            if (response.body.data.length > 0) {
                expect(response.body.data[0]).toHaveProperty("id");
                expect(response.body.data[0]).toHaveProperty("summary");
                expect(response.body.data[0]).toHaveProperty("content");
            }
        });
    });
});

describe("DELETE /ai-summaries/:id", () => {
    describe("Error cases", () => {
        test("Should return 401 when deleting summary without authentication", async () => {
            const response = await request(global.app)
                .delete("/ai-summaries/1");

            expect(response.status).toBe(401);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .delete("/ai-summaries/1")
                .set("Authorization", "Bearer invalid.token.here");

            expect(response.status).toBe(401);
        });

        test("Should handle non-existent summary id", async () => {
            const response = await request(global.app)
                .delete("/ai-summaries/99999")
                .set("Authorization", `Bearer ${token}`);

            expect([400, 404, 500]).toContain(response.status);
        });
    });

    describe("Success cases", () => {
        test("Should delete an existing summary", async () => {
            // First create a summary
            const createResponse = await request(global.app)
                .post("/ai-summaries")
                .set("Authorization", `Bearer ${token}`)
                .send(validSummaryContent);

            const summaryId = createResponse.body.data.id;

            // Then delete it
            const deleteResponse = await request(global.app)
                .delete(`/ai-summaries/${summaryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toMatchObject({
                error: false,
                message: "Resumo removido com sucesso.",
                data: {}
            });
        });
    });
});

describe("AI Summary Integration - Full CRUD Flow", () => {
    test("Should complete full CRUD cycle: create -> read -> delete", async () => {
        // CREATE
        const createResponse = await request(global.app)
            .post("/ai-summaries")
            .set("Authorization", `Bearer ${token}`)
            .send(validSummaryContent);

        expect(createResponse.status).toBe(200);
        const summaryId = createResponse.body.data.id;
        const summary = createResponse.body.data.summary;

        // READ
        const readResponse = await request(global.app)
            .get("/ai-summaries")
            .set("Authorization", `Bearer ${token}`);

        expect(readResponse.status).toBe(200);
        const foundSummary = readResponse.body.data.find(s => s.id === summaryId);
        expect(foundSummary).toBeDefined();
        expect(foundSummary.summary).toBe(summary);

        // DELETE
        const deleteResponse = await request(global.app)
            .delete(`/ai-summaries/${summaryId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.status).toBe(200);

        // VERIFY DELETION
        const verifyResponse = await request(global.app)
            .get("/ai-summaries")
            .set("Authorization", `Bearer ${token}`);

        const deletedSummary = verifyResponse.body.data.find(s => s.id === summaryId);
        expect(deletedSummary).toBeUndefined();
    });
});
