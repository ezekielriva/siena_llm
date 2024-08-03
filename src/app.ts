import express, {Application, Request, Response} from "express"
import "morgan"
import dotenv from "dotenv"
import morgan from "morgan";
import multer from "multer"

dotenv.config()

import IngestDataController from "./use_case/ingest_data"

var app:Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.get("/", (req:Request, res:Response) => {
    res.send({ "status": "ok" })
});

app.post("/upload", 
    upload.single("csv"), 
    IngestDataController
)

export default app;
