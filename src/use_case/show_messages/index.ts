import { Request, Response } from "express";
import db from "../../../db/client";
import { MessageRepository } from "../../repositories/message_repository";
import { Message } from "../../entities/message";

export default (req:Request, res:Response) => {
    const messageRepository:MessageRepository = new MessageRepository(db);
    
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    messageRepository.findByConversationId(id, limit as number, offset)
        .then( (m:Message[]) => res.status(200).json({ messages: m, limit: limit, page: page }) )
        .catch( (err:Error) => res.status(422).json({ status: "error", error: err }) )
}

