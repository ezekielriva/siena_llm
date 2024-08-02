import { describe, expect, test } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../../app";

describe("IngestDataController", () => {
    test("File Upload", async () => {
        await request(app)
        .post("/upload")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .then((res:Response) => {
                expect(res.body.status).toBe("uploaded");
            })
    })
});
