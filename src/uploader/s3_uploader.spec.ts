import { describe, expect, it } from "@jest/globals";
import S3Uploader from "./s3_uploader";
import { Readable } from "stream";
import { CompleteMultipartUploadCommandOutput, CreateMultipartUploadCommand, PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach } from "node:test";

describe("S3Uploader", () => {
    const S3ClientMock = mockClient(S3Client);
    
    describe("when the file is valid", () => {
        
        beforeEach( () => {
            S3ClientMock.reset();
        });
       
        it("uploads a file to S3", () => {
            S3ClientMock.on(CreateMultipartUploadCommand).resolves({});
            S3ClientMock.on(UploadPartCommand).resolves({});

            var uploader:S3Uploader = new S3Uploader();
            var stream:Readable = new Readable();
    
            stream.push("text");
            stream.push(null);
    
            return uploader.upload(stream)
                .then((output:CompleteMultipartUploadCommandOutput) => {
                    expect(output.Bucket).toEqual(process.env.S3_BUCKET_NAME);
                    expect(output.Location).toBeDefined();
                    expect(output.Key).toBeDefined();
                });
        });
    });

    describe("when the file is invalid", () => {

        beforeEach( () => {
            S3ClientMock.reset();
        });

        it("fails the file upload", () => {
            S3ClientMock.on(PutObjectCommand).rejects("mocked rejection");

            var uploader:S3Uploader = new S3Uploader();
            var stream:Readable = new Readable();
    
            stream.push("text");
            stream.push(null);
    
            return uploader.upload(stream)
                .then( () => { throw new Error("this shouldnt be executed") } )
                .catch( (err:Error) => {
                    expect(err.message).toContain("mocked rejection")
                })
        })
    })
});

