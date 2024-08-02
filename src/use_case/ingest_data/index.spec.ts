import { beforeEach, describe, expect, it } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../../app";
import { mockClient } from "aws-sdk-client-mock";
import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";

describe("IngestDataController", () => {
    const S3ClientMock = mockClient(S3Client);

    beforeEach( () => {
        S3ClientMock.reset();
    });
    
    it("Uploads a file to S3", async () => {
        S3ClientMock.on(CreateMultipartUploadCommand).resolves({});
        S3ClientMock.on(UploadPartCommand).resolves({});
        
        return request(app)
        .post("/upload")
            .set("Content-Type", "multipart/form-data")
            .set("Accept", "application/json")
            .attach("csv", `${__dirname}/../../../spec/files/sample.csv`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(201)
            .then((res:Response) => {                
                const { status, file } = res.body;
                const r:RegExp = new RegExp(`https:\/\/${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com\/(.+).csv`);
            
                expect(status).toBe("uploaded");
                expect(file).toMatch(r)
            });
    });

    describe("When csv is not provided", () => {
        it("Return 422 when there is no file", () => {
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

        it("Return 422 when the file format is not correct", () => {
            return request(app)
            .post("/upload")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .attach("csv", `${__dirname}/../../../spec/files/sample_error.csv`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(422)
                .then((res:Response) => {
                    expect(res.body.status).toBe("error");
                    expect(res.body.error).toBe("ValidationError: \"sender_username\" is not allowed to be empty. \"reciever_username\" is not allowed to be empty. \"message\" is not allowed to be empty. \"channel\" must be one of [instagram, facebook, whatsapp, email]");
                })
        })
    })
});
