import Joi from "joi";
import csvtojson from "csvtojson";
import { Readable, Stream } from "stream";
import { Message } from "../entities/message";

const VALID_CHANNELS:string[] = ["instagram", "facebook", "whatsapp", "email"];

const CSV_SCHEMA:Joi.ObjectSchema = Joi.object({
    sender_username: Joi.string().required(),
    reciever_username: Joi.string().required(),
    message: Joi.string().required(),
    channel: Joi.string().required().valid(...VALID_CHANNELS)
});

export default class CSVValidator {
    public errors:string[];

    constructor() {
        this.errors = [];
    }

    public async execute(stream: Readable):Promise<Readable> {
        const streamCopy = stream.pipe( new Stream.PassThrough() );
        const rows:Message[] = await csvtojson().fromStream(stream);        
        var rowCount:number = 0;

        for (const row of rows) {
            const { error } = CSV_SCHEMA.validate(row, { abortEarly: false });
            if (error) {
                this.errors.push( `row ${rowCount}: ${error}` );
            }
            
            rowCount++
        }

        if (rowCount < 1000) { this.errors.push(`csv file must have at least 1000 rows, current lenght ${rowCount} rows`); }
        if (this.errors.length > 0) { throw this.errors }

        return streamCopy;
    }
}
