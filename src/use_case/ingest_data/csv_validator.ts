import Joi from "joi";
import csvtojson from "csvtojson";
import { Readable } from "stream";

const VALID_CHANNELS:string[] = ["instagram", "facebook", "whatsapp", "email"];

const CSV_SCHEMA:Joi.ObjectSchema = Joi.object({
    sender_username: Joi.string().required(),
    reciever_username: Joi.string().required(),
    message: Joi.string().required(),
    channel: Joi.string().required().valid(...VALID_CHANNELS)
});

export default class CSVValidator {

    public async execute(stream: Readable):Promise<void> {
        const rows = await csvtojson().fromStream(stream);
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
    }
}
