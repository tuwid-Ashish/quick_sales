import express  from "express";
import cookieParser from "cookie-parser";
import Cors from "cors";
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app =  express()

app.use(Cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
}))

app.use(express.json({limit:"18kb"}))
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))



// app.get("/",(req,res)=>{
//     res.send("hello moto")
// })
// router import
import UserRouter from "./routes/agent.routes.js"
import AdminRouter from "./routes/admin.routes.js"
import PaymentRouter from "./routes/payments.routes.js"

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/admin",AdminRouter)
app.use("/api/v1/payment",PaymentRouter)


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public/build')));

// Wildcard route to handle React routing
app.get('*', (req, res) => {
    // Only serve index.html if the request is not an API request
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'));
    } else {
        res.status(404).json({ message: "API route not found" });
    }
});

export {  app }