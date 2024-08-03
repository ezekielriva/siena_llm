import { CompleteMultipartUploadCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { Readable, Stream } from "stream";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Upload } from "@aws-sdk/lib-storage";

const BUCKET_NAME:string = process.env.S3_BUCKET_NAME!
const AWS_REGION:string = process.env.AWS_REGION!

export default class S3Uploader {
    readonly client:S3Client
    
    constructor() {
        this.client = new S3Client({ region: AWS_REGION, credentials: fromEnv() });
    } 
    
    public async upload(stream:Readable):Promise<CompleteMultipartUploadCommandOutput> {
        // using Upload due to the possible file size.
        var upload:Upload = new Upload({
            client: this.client,
            params: { 
                Bucket: BUCKET_NAME, 
                Key: `${crypto.randomUUID()}.csv`, 
                Body: stream 
            },
        });

        return await upload.done();
    }
}
