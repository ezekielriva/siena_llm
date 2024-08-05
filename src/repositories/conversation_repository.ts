import { Database } from "sqlite3";
import { Conversation } from "../entities/conversation";

export class ConversationRepository {
    readonly TABLE_NAME:string = "conversations";
    readonly db:Database;

    constructor(db:Database) {
        this.db = db;
    }

    public findByParticipants(sender:string, receiver:string):Promise<Conversation> {
        const sql = `
            SELECT * FROM ${this.TABLE_NAME} 
            WHERE sender_username = ? AND
            receiver_username = ?
            LIMIT 1
        `
        
        return new Promise( (resolve, reject) => {
            this.db.all(sql, 
                [sender, receiver], 
                (err:Error|null, rows:Conversation[]) => {
                    if (err) { reject(err); }
                    resolve(rows[0])
            });
        } )
    }
}
