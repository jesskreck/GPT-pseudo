import express from "express"

import { getAllChats, sendPrompt, getSelectedChat } from "../controller/chatController.js"


const chatRouter = express.Router()

//NOTE Endpoint established as "/api/chats" in index.js
chatRouter.post("/completion", sendPrompt)
chatRouter.get("/completion", getAllChats)
chatRouter.get("/completion/id/:id", getSelectedChat)


// chatRouter.get("/completion/id/:number", getChat)



export default chatRouter