import { Database } from "sqlite3";
import { Message } from "../entities/message";

export class MessageRepository {
    readonly TABLE_NAME="messages";
    readonly db:Database;
    
    constructor(db:Database) {
        this.db = db;
    }

    public create(m:Message):Message {
        const sql = `
            INSERT INTO ${this.TABLE_NAME} (conversation_id, intent_id, message, channel) 
            VALUES (?,?,?,?)
        `

        this.db.run(
            sql, 
            [m.conversationId, m.intentId, m.message, m.channel],
            function(err:Error|null) {
                if (err != null ) { throw (err); }
                m.id = this.lastID
            }
        );

        return m
    }

    public findByConversationId(conversationId: number | string, limit:number, offset:number):Promise<Message[]> {
        const sql = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE conversation_id = ?
            LIMIT ? OFFSET ?
        `

        return new Promise( (resolve, reject) => {
            this.db.all(
                sql,
                [conversationId, limit, offset],
                ( err:Error|null, messages:Message[] ) => {
                    if (err) { reject(err) }
                    else { resolve(messages) }       
                }
            )
        });
    }

    public async deleteAll():Promise<void> {
        const sql = `DELETE FROM ${this.TABLE_NAME};`
        
        return new Promise<void>( (resolve, reject) => {
            this.db.run(sql, (err:Error | null) => {
                if (err) { reject(err); }
                else { resolve(); }
            });
        });
    }
}
