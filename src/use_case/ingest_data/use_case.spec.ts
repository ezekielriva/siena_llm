import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import IngestDataUseCase from "./use_case";
import fs from "fs"
import { Readable } from "stream";
import { mockClient } from "aws-sdk-client-mock";
import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import CSVValidator from "../../validator/csv_validator";
import S3Uploader from "../../uploader/s3_uploader";

jest.mock("../../validator/csv_validator");

describe("IngestDataUseCase", () => {
    const S3ClientMock = mockClient(S3Client);

    beforeEach( () => {
        S3ClientMock.reset();
        jest.restoreAllMocks();
    });

    it("returns s3 file location", () => {
        var stream:Readable = fs.createReadStream(`${__dirname}/../../../spec/files/sample.csv`)
        var validator:CSVValidator = new CSVValidator();
        var uploader:S3Uploader = new S3Uploader();
        var useCase:IngestDataUseCase = new IngestDataUseCase({validator, uploader});

        jest.mocked(validator.execute).mockResolvedValue(stream)

        S3ClientMock.on(CreateMultipartUploadCommand).resolves({});
        S3ClientMock.on(UploadPartCommand).resolves({});

        return useCase.execute(stream).then( (result:string) => {
            const r:RegExp = new RegExp(`https:\/\/${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com\/(.+).csv`);
            expect(result).toMatch(r)
        });
    });

    describe("When CSV is invalid", () => {
        it("return the errors", () => {
            var stream:Readable = fs.createReadStream(`${__dirname}/../../../spec/files/sample_error.csv`)
            var validator:CSVValidator = new CSVValidator();
            var uploader:S3Uploader = new S3Uploader();
            var useCase:IngestDataUseCase = new IngestDataUseCase({validator, uploader});

            return useCase.execute(stream).catch( (err) => {
                expect(err).toBeDefined();
            });
        });
    })
});
