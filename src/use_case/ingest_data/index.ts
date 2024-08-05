import { Request, Response } from "express";
import IngestDataUseCase from "./use_case";
import { Readable } from "stream";
import CSVValidator from "../../validator/csv_validator";
import S3Uploader from "../../uploader/s3_uploader";

export default (req:Request, res:Response) => {
    var { file } = req;

    if ( !file ) {
        return res.status(422).json({ status: "error", errors: ["file: missing"] });
    }

    const stream:Readable = Readable.from(file.buffer);
    var validator = new CSVValidator();
    var uploader = new S3Uploader();
    var useCase:IngestDataUseCase = new IngestDataUseCase({validator, uploader});

    useCase.execute(stream)
        .then( (s3_file:string) => res.status(201).json({ status: "uploaded", file: s3_file }) )
        .catch( (err) => res.status(422).json({ status: "error", errors: err }) )
}
