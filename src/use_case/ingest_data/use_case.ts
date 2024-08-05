import CSVValidator from "../../validator/csv_validator"
import { Readable } from "stream"
import S3Uploader from "../../uploader/s3_uploader"
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3"

type IngestDataUseCaseProperties = {
    validator:CSVValidator,
    uploader:S3Uploader
}

export default class IngestDataUseCase {
    private validator:CSVValidator
    private uploader:S3Uploader
    
    constructor(props:IngestDataUseCaseProperties) {
        this.validator = props.validator;
        this.uploader = props.uploader;
    }

    public async execute(stream:Readable):Promise<string> {
        return this.validator.execute(stream)
            .then( (stream:Readable) => { return this.uploader.upload(stream)} )
            .then( (output:CompleteMultipartUploadCommandOutput) => output.Location! )
    }
}
