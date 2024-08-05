import { randomUUID } from "crypto";
import fs from "fs";

const VALID_CHANNELS:string[] = ["instagram", "facebook", "whatsapp", "email"];
const USERNAMES:string[] = ["@bogoman", "@helloworld", "@ashdev", "@meowcat", "@shopper", "@buyer", "@customer", "@seller", "@merchant", "@vendor"];
const MESSAGES:string[] = [
    "How are you doing?",
    "Do you ship internationally?",
    "What is the return policy?",
    "Can I track my order?",
    "Do you have discounts available?",
    "What payment methods do you accept?",
    "Is there a warranty on this product?",
    "How can I contact customer support?",
    "When will my order arrive?",
    "Do you have this item in stock?"
];

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min:number, max:number):number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random element from an array
const getRandomElement = (arr:string[]):string => {
    return arr[getRandomInt(0, arr.length - 1)];
};

const generateCSVContent = (numRows:number) => {
    let csvContent:string = "sender_username,reciever_username,message,channel\n";

    for (let i:number = 0; i < numRows; i++) {
        const sender = getRandomElement(USERNAMES);
        const receiver = getRandomElement(USERNAMES);
        const message = getRandomElement(MESSAGES);
        const channel = getRandomElement(VALID_CHANNELS);
        csvContent += `${sender},${receiver},${message},${channel}\n`;
    }

    return csvContent;
};

// Generate CSV content with 1000 rows
const csvContent = generateCSVContent(1000);

// Write CSV content to a file
var path:string = `${__dirname}/../spec/files/sample_${randomUUID().toString()}.csv`;
fs.appendFile(path, csvContent, (err: NodeJS.ErrnoException | null) => {
    if (err) { console.error(`Unable to generate CSV ${path}`, err) }
    else { console.log('CSV file generated successfully!'); }
});

