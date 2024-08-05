import db from "../db/client";
import { Intent } from "../src/entities/intent";
import { IntentRepository } from "../src/repositories/intent_repository";

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

INTENTS.forEach( (i:Intent) => {
    console.log(`Creating intent ${i.name}`);
    repo.create(i);
});
