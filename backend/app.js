import express  from "express";
import cookieParser from "cookie-parser";
import Cors from "cors";

const app =  express()

app.use(Cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
}))

app.use(express.json({limit:"18kb"}))
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res)=>{
    res.send("hello moto")
})
// router import
import UserRouter from "./routes/agent.routes.js"
import AdminRouter from "./routes/admin.routes.js"
import PaymentRouter from "./routes/payments.routes.js"

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/admin",AdminRouter)
app.use("/api/v1/payment",PaymentRouter)


export {  app }