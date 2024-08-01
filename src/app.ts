import express, {Application, Express, Request, Response} from "express"
import "morgan"
import dotenv from "dotenv"
import morgan from "morgan";

dotenv.config()

var app:Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

app.get("/", (req:Request, res:Response) => {
    res.send({ "status": "ok" })
});

export default app;
