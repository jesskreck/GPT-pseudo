import express from "express"

import { test, getAllChats, sendPrompt, getSelectedChat } from "../controller/chatController.js"


const chatRouter = express.Router()

//NOTE Endpoint established as "/api/chats" in index.js
chatRouter.get("/test", test)
chatRouter.post("/completion", sendPrompt)
chatRouter.get("/completion", getAllChats)
chatRouter.post("/completion/title", )
chatRouter.get("/completion/title/:title", getSelectedChat)


// chatRouter.get("/completion/id/:number", getChat)



export default chatRouter