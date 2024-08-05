import { Database } from "sqlite3";
import { Intent } from "../entities/intent";

export class IntentRepository {
    readonly TABLE_NAME:string = "intents"
    readonly db:Database;
    
    constructor(db:Database) {
        this.db = db;
    }

    public async create(i:Intent):Promise<Intent> {
        const sql = `INSERT INTO ${this.TABLE_NAME} (name) VALUES (?)`;
        var prom:Promise<Intent> = new Promise<Intent>( (resolve, reject) => {
            this.db.run(sql, [i.name], function(err: Error|null) {
                if (err != null ) { reject(err); }
                i.id = this.lastID
                resolve(i);
            });
        });

        return prom;
    }

    public async findByName(name:string):Promise<Intent> {
        const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE name = ?`
        return new Promise<Intent>( (resolve, reject) => {
            this.db.all(sql,[name], (err:Error | null, rows:Intent[]) => {
                if (err) { reject(err); }
                resolve(rows[0])
            });
        });
    }

    public async deleteAll():Promise<void> {
        const sql = `DELETE FROM ${this.TABLE_NAME};`
        
        return new Promise<void>( (resolve, reject) => {
            this.db.all(sql, (err:Error | null, rows:Intent[]) => {
                if (err) { reject(err); }
                else { resolve() }
            });
        });
    }

    public async findAll():Promise<Intent[]> {
        const sql = `
            SELECT * FROM ${this.TABLE_NAME}
        `

        return new Promise<Intent[]>( (resolve, reject) => {
            this.db.all(sql, (err:Error | null, rows:Intent[]) => {
                if (err) { reject(err); }
                else { resolve(rows) }
            });
        } )
    }
}
