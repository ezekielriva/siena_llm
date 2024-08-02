// Use Case: Ingest Data:
// 1. Receive a csv file:
// 2. Enforce these constraints:
// - Validate the format of the CSV
// - There should be 1000 records in the csv
// - Channels can be: instagram, facebook, whatsapp, email.
// 3. Upload file to S3 Bucket
// 4. Remove local file
// 5. Return S3 file location

import { ReadStream } from "fs"
import CSVValidator from "./csv_validator"

export default class IngestDataUseCase {
    private stream:ReadStream
    private validator:CSVValidator
    
    constructor(stream:ReadStream) {
        this.stream = stream
        this.validator = new CSVValidator();
    }

    public async execute() {
        await this.validator.execute(this.stream);
        return `https://${process.env.S3_BUCKET_NAME!}.s3.amazonaws.com/sample.csv`
    }



}
