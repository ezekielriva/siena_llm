import { Request, Response } from "express";
import IngestDataUseCase from "./use_case";
import { Readable } from "stream";

export default (req:Request, res:Response) => {
    var { file } = req;

    if ( !file ) {
        return res.status(422).json({ status: "error", error: "missing file" });
    }

    const stream:Readable = Readable.from(file.buffer);
    var useCase:IngestDataUseCase = new IngestDataUseCase(stream);

    useCase.execute()
        .then( (s3_file:string) => res.status(201).json({ status: "uploaded", file: s3_file }) )
        .catch( (err:Error) => res.status(422).json({ status: "error", error: err.message }) )
}
