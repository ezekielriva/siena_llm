import app from "./app";

const port:string = process.env.PORT!;

app.listen(port, () => {
    console.log(`Server listening to 127.0.0.1:${port}`);
});
