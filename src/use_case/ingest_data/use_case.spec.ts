import { beforeEach, describe, expect, it, test } from "@jest/globals";
import IngestDataUseCase from "./use_case";
import fs from "fs"
import { Readable } from "stream";
import { mockClient } from "aws-sdk-client-mock";
import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";

describe("IngestDataUseCase", () => {
    const S3ClientMock = mockClient(S3Client);

    beforeEach( () => {
        S3ClientMock.reset();
    });

    test("returns s3 file location", () => {
        var stream:Readable = fs.createReadStream(`${__dirname}/../../../spec/files/sample.csv`)
        var useCase:IngestDataUseCase = new IngestDataUseCase(stream);

        S3ClientMock.on(CreateMultipartUploadCommand).resolves({});
        S3ClientMock.on(UploadPartCommand).resolves({});

        return useCase.execute().then( (result:string) => {
            const r:RegExp = new RegExp(`https:\/\/${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com\/(.+).csv`);
            expect(result).toMatch(r)
        });
    });

    describe("When CSV is invalid", () => {
        it("return the errors", () => {
            var stream:Readable = fs.createReadStream(`${__dirname}/../../../spec/files/sample_error.csv`)
            var useCase:IngestDataUseCase = new IngestDataUseCase(stream);

            return useCase.execute().catch( (err) => {
                expect(err).toBeDefined();
            });
        });
    })
});
