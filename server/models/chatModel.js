// according to diagram: i just want one chatcollection that holds prompt and response.
import mongoose from "mongoose";
import promptSchema from "./_children/prompt.js";
import responseSchema from "./_children/response.js";

const dialogueSchema = new mongoose.Schema({
    
    prompts: promptSchema,
    responses: responseSchema,
    favorite: { type: Boolean }

    //TODO add props here like "add context: boolean"

    //TODO make sure timestamp is generated only once at beginning (created at)
}, { timestamp: true })

const chatSchema = new mongoose.Schema({
    //STUB make owner prop work
    owner: { type: String, default: "owner_placeholder"},
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    history: [dialogueSchema]

})


const Chat = mongoose.model("chat", chatSchema)


export default Chat




// // sample chat JSON based on Chat model
// {
//   "owner": "6447de1fd866da26af498658",
//   "history": [
//     {
//       "prompts": {
//         "model": "gpt-3.5-turbo",
//         "messages": [
//           {
//             "role": "system",
//             "content": "You are a helpful assistant."
//           },
//           {
//             "role": "user",
//             "content": "Who won the world series in 2020?"
//           },
//           {
//             "role": "assistant",
//             "content": "The Los Angeles Dodgers won the World Series in 2020."
//           }
//         ]
//       },
//       "responses": {
//         "id": "chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve",
//         "object": "chat.completion",
//         "created": 1677649420,
//         "choices": [
//           {
//             "index": 0,
//             "message": {
//               "role": "assistant",
//               "content": "The Los Angeles Dodgers won the World Series in 2020."
//             },
//             "finish_reason": "stop"
//           }
//         ],
//         "usage": {
//           "prompt_tokens": 56,
//           "completion_tokens": 31,
//           "total_tokens": 87
//         }
//       },
//       "favorite": true
//     }
//   ]
// }
