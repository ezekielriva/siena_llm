import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import request, { Response } from "supertest";
import app from "../../app";
import { ConversationRepository } from "../../repositories/conversation_repository";
import db from "../../../db/client";
import { Conversation } from "../../entities/conversation";

describe("ListConversationsController", () => {
    var conversationRepository = new ConversationRepository(db);
    var conversationUT:Conversation;

    beforeEach( async () => {
        conversationUT = await conversationRepository.create({ sender_username: "1", receiver_username: "1" });
        conversationRepository.create({ sender_username: "2", receiver_username: "b" });
        conversationRepository.create({ sender_username: "3", receiver_username: "b" });
        conversationRepository.create({ sender_username: "4", receiver_username: "b" });
        conversationRepository.create({ sender_username: "5", receiver_username: "b" });
    });

    afterEach( () => conversationRepository.deleteAll() );
    
    it("returns all conversations in the db paginated", () => {
        return request(app)
        .get("/conversations")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .query("limit=2")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .then((res:Response) => {                
                var { conversations, limit, page } = res.body;
                
                expect( conversations ).toHaveLength(2);
                expect( limit ).toBe("2");
                expect( page ).toBe(1);

                expect( conversations[0].id ).toBe(conversationUT.id)
            }).catch( (err:Error)=>{ throw err } );
    });
});
