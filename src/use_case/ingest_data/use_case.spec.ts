import { describe, expect, it, test } from "@jest/globals";
import IngestDataUseCase from "./use_case";
import fs from "fs"

describe("IngestDataUseCase", () => {
    test("returns s3 file location", () => {
        var stream:fs.ReadStream = fs.createReadStream(`${__dirname}/../../../spec/files/sample.csv`)
        var useCase:IngestDataUseCase = new IngestDataUseCase(stream);

        return useCase.execute().then( (result:string) => {
            expect(result).toBe(`https://${process.env.S3_BUCKET_NAME!}.s3.amazonaws.com/sample.csv`)
        });
    });

    describe("When CSV is invalid", () => {
        it("return the errors", () => {
            var stream:fs.ReadStream = fs.createReadStream(`${__dirname}/../../../spec/files/sample_error.csv`)
            var useCase:IngestDataUseCase = new IngestDataUseCase(stream);

            return useCase.execute().catch( (err) => {
                expect(err).toBeDefined();
            });
        });
    })
});
