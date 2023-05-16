import express from "express"

import { test, getChats, sendPrompt } from "../controller/chatController.js"


const chatRouter = express.Router()

//NOTE Endpoint established as "/api/chats" in index.js
chatRouter.get("/test", test)
chatRouter.post("/completion", sendPrompt)
chatRouter.get("/completion", getChats)

// chatRouter.get("/completion/id/:number", getChat)



export default chatRouter