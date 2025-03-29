import dotenv from "dotenv";
import { ConnectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./env" });


ConnectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("the server is listening on port ", process.env.PORT);
    })
    app.get("/", (rq,res)=>{
        res.send("hello server side ")
    })
})