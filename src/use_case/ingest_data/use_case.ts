// Use Case: Ingest Data:
// 1. Receive a csv file:
// 2. Enforce these constraints:
// - Validate the format of the CSV
// - There should be 1000 records in the csv
// - Channels can be: instagram, facebook, whatsapp, email.
// 3. Upload file to S3 Bucket
// 4. Remove local file
// 5. Return S3 file location

import CSVValidator from "../../validator/csv_validator"
import { Readable } from "stream"
import S3Uploader from "../../uploader/s3_uploader"
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3"

export default class IngestDataUseCase {
    private stream:Readable
    private validator:CSVValidator
    private uploader:S3Uploader
    
    constructor(stream:Readable) {
        this.stream = stream
        this.validator = new CSVValidator();
        this.uploader = new S3Uploader();
    }

    public async execute():Promise<string> {
        return this.validator.execute(this.stream)
            .then( () => this.uploader.upload(this.stream))
            .then( (output:CompleteMultipartUploadCommandOutput) => output.Location! )
    }
}
