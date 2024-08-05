import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../../app";
import { ConversationRepository } from "../../repositories/conversation_repository";
import { MessageRepository } from "../../repositories/message_repository";
import db from "../../../db/client";
import { Conversation } from "../../entities/conversation";
import { Message } from "../../entities/message";

describe("ListConversationsController", () => {
    var conversationRepository:ConversationRepository = new ConversationRepository(db);
    var messageRepository:MessageRepository = new MessageRepository(db);
    var conversationUT:Conversation;
    var messageUT:Message;

    beforeEach( async () => {
        conversationUT = await conversationRepository.create({ sender_username: "1", receiver_username: "1" });
        messageUT = await messageRepository.create({
            conversationId: conversationUT.id!,
            sender_username: conversationUT.sender_username,
            reciever_username: conversationUT.receiver_username,
            message: "Hello there. Do you do international shipping?",
            channel: "instagram",
        } as Message)

        messageRepository.create({ conversationId: conversationUT.id!, sender_username: conversationUT.sender_username, reciever_username: conversationUT.receiver_username, message: "Yes, we do international shipping", channel: "instagram", } as Message)
    });

    afterEach( () => {
        conversationRepository.deleteAll();
        messageRepository.deleteAll();
    });
    
    it("returns all conversations in the db paginated", () => {
        return request(app)
        .get(`/conversations/${conversationUT.id}/messages`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .query("limit=2")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .then((res:Response) => {                
                var { messages, limit, page } = res.body;
                
                expect( messages ).toHaveLength(2);
                expect( limit ).toBe("2");
                expect( page ).toBe(1);

                expect( messages[0].id ).toBe(messageUT.id)
            }).catch( (err:Error)=>{ throw err } );
    });
});
