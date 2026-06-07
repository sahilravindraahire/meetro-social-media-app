import dotenv from "dotenv"
dotenv.config()

import {connectDB} from "./db/dataBase.js"
import cors from "cors"
import {app, server} from "./socket/socket.js"
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import loopRoutes from "./routes/loop.route.js"
import storyRoutes from "./routes/story.route.js"
import messageRoutes from "./routes/message.route.js"

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/loops", loopRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/messages", messageRoutes)

app.use((err, req, res, next) => {
    console.log("ERROR HANDLER HIT:", err)  
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        message
    })
})

const port = process.env.PORT || 5000

connectDB()
.then(() => {
    try {
        server.listen(port, () => {
            console.log(`server is at: http://localhost${port}`)
        })
    } catch (error) {
        console.log(`error while connecting to server: `, error)
    }
})
