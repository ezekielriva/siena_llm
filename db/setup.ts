import db from "./client";

console.log("Creating TABLE conversations...");
db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_username VARCHAR(50),
      receiver_username VARCHAR(50)
    );
`);

console.log("Creating TABLE intents...");
db.exec(`
    CREATE TABLE IF NOT EXISTS intents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255)
    );
`)

console.log("Creating TABLE messages...");
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INT REFERENCES conversations(id),
        intent_id INT REFERENCES intents(id),
        message TEXT,
        channel VARCHAR(50)
    );
`);
