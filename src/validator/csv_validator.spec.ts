import { expect, it, jest } from "@jest/globals";
import fs, { ReadStream } from "fs";
import { describe } from "node:test";
import CSVValidator from "./csv_validator";

describe("CsvValidator", () => {
    const VALID_FILE_PATH:string = `${__dirname}/../../spec/files/sample_error.csv`

    it("throw an error", () => {
        var stream:ReadStream = fs.createReadStream(VALID_FILE_PATH);

        var validator:CSVValidator = new CSVValidator();

        return validator.execute(stream).catch( (errors:Error[]) => {
            expect(errors).toHaveLength(2);
            expect(errors).toContain("csv file must have at least 1000 rows, current lenght 1 rows");
            expect(errors).toContain("row 0: ValidationError: \"sender_username\" is not allowed to be empty. \"reciever_username\" is not allowed to be empty. \"message\" is not allowed to be empty. \"channel\" must be one of [instagram, facebook, whatsapp, email]");
        } );
    });
});
