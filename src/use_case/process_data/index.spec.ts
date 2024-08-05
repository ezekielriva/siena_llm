import { handler } from "./index";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";
import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {sdkStreamMixin} from '@smithy/util-stream';

import ProcessDataUseCase from "./use_case";

jest.mock("./use_case");

describe("ProcessDataHandler", () => {
    const S3ClientMock = mockClient(S3Client);
    
    beforeEach( () => {
        S3ClientMock.reset();
        jest.restoreAllMocks();
    });

    it("process the s3 file", async () => {
        const mockedUseCase = jest.mocked(ProcessDataUseCase)
        jest.mock
        var stream:Readable = Readable.from("Text");

        S3ClientMock.on(GetObjectCommand).resolves({
            Body: sdkStreamMixin(stream)
        });

        await handler({ Records: [
            { 
                s3: {
                    bucket: { name: process.env.S3_BUCKET_NAME! },
                    object: {
                        key: "https://llm-csv.s3.amazonaws.com/0517816f-0ffd-4a5a-8a5f-9d706f0f6a6e.csv"
                    }
                }
            }
        ]} as S3Event )
        
        expect( mockedUseCase ).toHaveBeenCalled()
    })
})
