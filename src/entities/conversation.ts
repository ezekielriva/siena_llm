export type ConversationID = number

export type Conversation = {
    id?:ConversationID
    sender_username:string
    receiver_username:string
}
