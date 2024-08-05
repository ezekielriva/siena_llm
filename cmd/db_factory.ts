import csvtojson from "csvtojson";
import db from "../db/client";
import { Intent } from "../src/entities/intent";
import { IntentRepository } from "../src/repositories/intent_repository";
import { MessageRepository } from "../src/repositories/message_repository";
import { ConversationRepository } from "../src/repositories/conversation_repository";
import { Message } from "../src/entities/message";
import { Conversation } from "../src/entities/conversation";

const INTENTS:Intent[] = [
    {name: "Request for international shipping information"},
    {name: "Request for veteran discount"},
    {name: "Inquiry about return policy"},
    {name: "Inquiry about order status"},
    {name: "Request for product details"},
    {name: "Inquiry about payment methods"},
    {name: "Inquiry about shipping times"},
    {name: "Inquiry about product availability"},
    {name: "Request for cancellation of order"},
    {name: "Inquiry about account details"}
];

var repo:IntentRepository = new IntentRepository(db);
repo.deleteAll()
var msgRepo:MessageRepository = new MessageRepository(db);
msgRepo.deleteAll()
var conRepo:ConversationRepository = new ConversationRepository(db);
conRepo.deleteAll()

INTENTS.forEach( async (i:Intent) => {
    console.log(`Creating intent ${i.name}`);
    await repo.create(i);
});

csvtojson().fromFile(`${__dirname}/../spec/files/sample_9276ae4b-2dd6-42f2-9fd6-dd77c64a8808.csv`)
    .then( async (rows:Message[]) => {
        for ( const row of rows ) {
            
            let conversation:Conversation = await conRepo.findByParticipants(row.sender_username, row.reciever_username);
            
            if (!conversation) {
                conversation = await conRepo.create({ sender_username: row.sender_username, receiver_username: row.reciever_username });
            }
            
            row.conversationId = conversation.id!
            
            console.log(`Creating message "${row.message}" in channel "${row.channel}" for conversation ${conversation.id}`)
            msgRepo.create(row);
        }
    })

