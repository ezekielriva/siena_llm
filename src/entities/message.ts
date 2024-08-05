import { ConversationID } from "./conversation"
import { IntentID } from "./intent"

export type MessageID = number;

export type Channel = 'instagram' | 'facebook' | 'whatsapp' | 'email';

export type Message = {
    id?:MessageID,
    sender_username:string,
    reciever_username:string,
    message:string
    channel:Channel
    conversationId:ConversationID,
    intentId:IntentID
    intent:string
};

