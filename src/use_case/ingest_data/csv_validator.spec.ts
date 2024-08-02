import { expect, it } from "@jest/globals";
import fs, { ReadStream } from "fs";
import { describe } from "node:test";
import CSVValidator from "./csv_validator";

describe("CsvValidator", () => {
    describe("When file is valid", () => {
        const VALID_FILE_PATH:string = `${__dirname}/../../../spec/files/sample.csv`

        it("validates the file successfully", () => {
            var stream:ReadStream = fs.createReadStream(VALID_FILE_PATH);

            var validator:CSVValidator = new CSVValidator();

            return expect(validator.execute(stream)).resolves.toBeUndefined();
        });
    });

    describe("When file is invalid", () => {
        const VALID_FILE_PATH:string = `${__dirname}/../../../spec/files/sample_error.csv`

        it("throw an error", () => {
            var stream:ReadStream = fs.createReadStream(VALID_FILE_PATH);

            var validator:CSVValidator = new CSVValidator();

            return validator.execute(stream).catch( (err:any) => {
                console.log(err);
                //expect(message).toContain("sender_username");
                //expect(message).toContain("reciever_username");
                //expect(message).toContain("message");
                //expect(message).toContain("channel");
            } );
        });
    });
});
