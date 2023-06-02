// according to diagram: i just want one chatcollection that holds prompt and response.
import mongoose from "mongoose";
import promptSchema from "./_children/prompt.js";
import responseSchema from "./_children/response.js";


// sub schema
const dialogueSchema = new mongoose.Schema({

    prompt: String,
    response: String,
    temp: Number,
    topP: Number,
    promptTokens: Number,
    responseTokens: Number,
    totalTokens: Number,
    promptObject: promptSchema,
    responseObject: responseSchema,
    inContext: Boolean,

}, { timestamp: true })


////// MAIN SCHEMA
const chatSchema = new mongoose.Schema({
    title: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    history: [dialogueSchema]

})

////////// Model
const Chat = mongoose.model("chat", chatSchema)


export default Chat



