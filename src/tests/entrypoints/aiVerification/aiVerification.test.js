const request = require("supertest");
const { getAuthToken } = require("../../utils/account.util");

let token;
let createdVerificationId;

beforeAll(async () => {
    token = await getAuthToken();
});

const validVerificationData = {
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    referenceContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
};

describe("POST /ai-verifications", () => {
    describe("Error cases", () => {
        test("Should return 401 when creating verification without authentication", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .send(validVerificationData);

            expect(response.status).toBe(401);
        });

        test("Should return 400 when content is missing", async () => {
            const { content, ...data } = validVerificationData;

            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send(data);

            expect(response.status).toBe(400);
        });

        test("Should return 400 when content is empty", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validVerificationData, content: "" });

            expect(response.status).toBe(400);
        });

        test("Should return 400 when content has less than 10 characters", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send({ 
                    content: "Muito curto",
                    referenceContent: validVerificationData.referenceContent 
                });

            expect(response.status).toBe(400);
        });

        test("Should return 400 when referenceContent is missing", async () => {
            const { referenceContent, ...data } = validVerificationData;

            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send(data);

            expect(response.status).toBe(400);
        });

        test("Should return 400 when referenceContent is empty", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send({ ...validVerificationData, referenceContent: "" });

            expect(response.status).toBe(400);
        });

        test("Should return 400 when referenceContent has less than 10 characters", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send({ 
                    content: validVerificationData.content,
                    referenceContent: "Muito curto"
                });

            expect(response.status).toBe(400);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", "Bearer invalid.token.here")
                .send(validVerificationData);

            expect(response.status).toBe(401);
        });
    });

    describe("Success cases", () => {
        test("Should create verification with valid data and return score and feedback", async () => {
            const response = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send(validVerificationData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                error: false,
                message: "Verificação realizada com sucesso.",
                data: expect.objectContaining({
                    id: expect.any(Number),
                    score: expect.any(Number),
                    feedback: expect.any(String)
                })
            });

            // Validate score is between 0 and 100
            expect(response.body.data.score).toBeGreaterThanOrEqual(0);
            expect(response.body.data.score).toBeLessThanOrEqual(100);

            // Validate feedback is not empty
            expect(response.body.data.feedback.length).toBeGreaterThan(0);

            createdVerificationId = response.body.data.id;
        });
    });
});

describe("GET /ai-verifications", () => {
    describe("Error cases", () => {
        test("Should return 401 when listing verifications without authentication", async () => {
            const response = await request(global.app)
                .get("/ai-verifications");

            expect(response.status).toBe(401);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .get("/ai-verifications")
                .set("Authorization", "Bearer invalid.token.here");

            expect(response.status).toBe(401);
        });
    });

    describe("Success cases", () => {
        test("Should return array of verifications for authenticated user", async () => {
            const response = await request(global.app)
                .get("/ai-verifications")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                error: false,
                message: "Verificações listadas com sucesso.",
                data: expect.any(Array)
            });
        });

        test("Should have correct data structure in verifications list", async () => {
            const response = await request(global.app)
                .get("/ai-verifications")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            
            if (response.body.data.length > 0) {
                expect(response.body.data[0]).toHaveProperty("id");
                expect(response.body.data[0]).toHaveProperty("score");
                expect(response.body.data[0]).toHaveProperty("feedback");
                expect(response.body.data[0]).toHaveProperty("content");
                
                // Validate score constraints
                expect(response.body.data[0].score).toBeGreaterThanOrEqual(0);
                expect(response.body.data[0].score).toBeLessThanOrEqual(100);
            }
        });
    });
});

describe("DELETE /ai-verifications/:id", () => {
    describe("Error cases", () => {
        test("Should return 401 when deleting verification without authentication", async () => {
            const response = await request(global.app)
                .delete("/ai-verifications/1");

            expect(response.status).toBe(401);
        });

        test("Should return 401 with invalid token", async () => {
            const response = await request(global.app)
                .delete("/ai-verifications/1")
                .set("Authorization", "Bearer invalid.token.here");

            expect(response.status).toBe(401);
        });

        test("Should handle non-existent verification id", async () => {
            const response = await request(global.app)
                .delete("/ai-verifications/99999")
                .set("Authorization", `Bearer ${token}`);

            expect([400, 404, 500]).toContain(response.status);
        });
    });

    describe("Success cases", () => {
        test("Should delete an existing verification", async () => {
            // First create a verification
            const createResponse = await request(global.app)
                .post("/ai-verifications")
                .set("Authorization", `Bearer ${token}`)
                .send(validVerificationData);

            const verificationId = createResponse.body.data.id;

            // Then delete it
            const deleteResponse = await request(global.app)
                .delete(`/ai-verifications/${verificationId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toMatchObject({
                error: false,
                message: "Verificação removida com sucesso.",
                data: {}
            });
        });
    });
});

describe("AI Verification Integration - Full CRUD Flow", () => {
    test("Should complete full CRUD cycle: create -> read -> delete", async () => {
        // CREATE
        const createResponse = await request(global.app)
            .post("/ai-verifications")
            .set("Authorization", `Bearer ${token}`)
            .send(validVerificationData);

        expect(createResponse.status).toBe(200);
        const verificationId = createResponse.body.data.id;
        const score = createResponse.body.data.score;
        const feedback = createResponse.body.data.feedback;

        // READ
        const readResponse = await request(global.app)
            .get("/ai-verifications")
            .set("Authorization", `Bearer ${token}`);

        expect(readResponse.status).toBe(200);
        const foundVerification = readResponse.body.data.find(v => v.id === verificationId);
        expect(foundVerification).toBeDefined();
        expect(foundVerification.score).toBe(score);
        expect(foundVerification.feedback).toBe(feedback);

        // DELETE
        const deleteResponse = await request(global.app)
            .delete(`/ai-verifications/${verificationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.status).toBe(200);

        // VERIFY DELETION
        const verifyResponse = await request(global.app)
            .get("/ai-verifications")
            .set("Authorization", `Bearer ${token}`);

        const deletedVerification = verifyResponse.body.data.find(v => v.id === verificationId);
        expect(deletedVerification).toBeUndefined();
    });

    test("Should verify score is always between 0 and 100", async () => {
        const response = await request(global.app)
            .post("/ai-verifications")
            .set("Authorization", `Bearer ${token}`)
            .send(validVerificationData);

        expect(response.status).toBe(200);
        expect(response.body.data.score).toBeGreaterThanOrEqual(0);
        expect(response.body.data.score).toBeLessThanOrEqual(100);
    });

    test("Should verify feedback is always provided", async () => {
        const response = await request(global.app)
            .post("/ai-verifications")
            .set("Authorization", `Bearer ${token}`)
            .send(validVerificationData);

        expect(response.status).toBe(200);
        expect(response.body.data.feedback).toBeTruthy();
        expect(typeof response.body.data.feedback).toBe("string");
    });
});
