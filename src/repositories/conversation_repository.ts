import { Database } from "sqlite3";
import { Conversation } from "../entities/conversation";

export class ConversationRepository {
    readonly TABLE_NAME:string = "conversations";
    readonly db:Database;

    constructor(db:Database) {
        this.db = db;
    }
    
    public create(c:Conversation):Promise<Conversation> {
        const sql = `
            INSERT INTO ${this.TABLE_NAME} (sender_username, receiver_username) 
            VALUES (?,?);
        `
        
        return new Promise( (resolve, reject) => {
            this.db.run(sql, 
                [c.receiver_username, c.receiver_username], 
                function(err:Error|null) {
                    if (err) { reject(err); }
                    c.id = this.lastID;
                    resolve(c)
            });
        } )
    }

    public findByParticipants(sender:string, receiver:string):Promise<Conversation> {
        const sql = `
            SELECT * FROM ${this.TABLE_NAME} 
            WHERE sender_username = ? AND
            receiver_username = ?
            LIMIT 1;
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

    public findAll(limit:number, offset:number):Promise<Conversation[]> {
        const sql = `SELECT * FROM ${this.TABLE_NAME} LIMIT ? OFFSET ?;`

        return new Promise( (resolve, reject) => {
            this.db.all(
                sql,
                [limit, offset],
                (err:Error|null, rows:Conversation[]) => {
                    if (err) { reject(err); }
                    resolve(rows)
            })
        })
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
