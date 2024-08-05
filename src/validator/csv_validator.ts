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

    public async execute(stream: Readable):Promise<Readable> {
        const streamCopy = stream.pipe( new Stream.PassThrough() );
        const rows:Message[] = await csvtojson().fromStream(stream);
        const errors: Joi.ValidationError[] = [];

        for (const row of rows) {
            const { error } = CSV_SCHEMA.validate(row, { abortEarly: false });
            if (error) {
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join("; "));
        }

        return streamCopy;
    }
}
