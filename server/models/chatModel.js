// according to diagram: i just want one chatcollection that holds prompt and response.
import mongoose from "mongoose";
import promptSchema from "./_children/prompt";
import responseSchema from "./_children/response";

const dialogueSchema = new mongoose.Schema({
    
    prompts: promptSchema,
    responses: responseSchema,
    favorite: { type: Boolean }

    //TODO add props here like "add context: boolean"

    //TODO make sure timestamp is generated only once at beginning (created at)
}, { timestamp: true })

const chatSchema = new mongoose.Schema({
    //STUB check which reference it needs to be
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    history: [dialogueSchema]

})


const Chat = mongoose.model("chat", chatSchema)


export default Chat