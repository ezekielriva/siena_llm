import { describe, expect, test } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../../app";

describe("IngestDataController", () => {
    test("File Upload", async () => {
        return request(app)
        .post("/upload")
            .set("Content-Type", "multipart/form-data")
            //.set("Accept", "application/json")
            .attach("csv", `${__dirname}/../../../spec/files/sample.csv`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(201)
            .then((res:Response) => {                
                const { status, file } = res.body;
            
                expect(status).toBe("uploaded");
                expect(file).toContain("sample.csv");
                expect(file).toContain(process.env.S3_BUCKET_NAME);
            });
    });

    describe("When csv is not provided", () => {
        test("Return 422", () => {
            return request(app)
            .post("/upload")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(422)
                .then((res:Response) => {
                    expect(res.body.status).toBe("error");
                    expect(res.body.error).toBe("missing file");
                })
        })
    })
});
