import { Database } from "sqlite3";
import { Message } from "../entities/message";

export class MessageRepository {
    readonly db:Database;
    
    constructor(db:Database) {
        this.db = db;
    }

    public create(m:Message):Message {
        const sql = `INSTER INTO messages (conversation_id, intent_id, message, channel) VALUES (?,?,?,?)`

        this.db.run(
            sql, 
            [m.conversationId, m.intentID, m.message, m.channel],
            function(err:Error|null) {
                if (err != null ) { throw (err); }
                m.id = this.lastID
            }
        );

        return m
    }
}
