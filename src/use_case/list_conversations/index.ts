import { Request, Response } from "express";
import { ConversationRepository } from "../../repositories/conversation_repository";
import db from "../../../db/client";
import { Conversation } from "../../entities/conversation";

export default (req:Request, res:Response) => {
    const conversationRepository:ConversationRepository = new ConversationRepository(db);

    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    conversationRepository.findAll(limit as number, offset)
        .then( (c:Conversation[]) => res.status(200).json({ conversations: c, limit: limit, page: page }) )
        .catch( (err:Error) => res.status(422).json({ status: "error", error: err }) )
}
