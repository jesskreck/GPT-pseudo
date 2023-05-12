import mongoose from "mongoose"
import messageSchema from "./message"

// for chat completion request from OpenAI API
const promptSchema = new mongoose.Schema({
    
    model: { type: String, required: true },
    messages: [messageSchema],
    // sampling temperature between 0-2. default 1. 
    temperature: Number,
    // alternative to sampling with temperature
    top_p: Number,
    // how many chat completions to generate. default 1. 
    n: Number,
    // print response while its generated. default false
    stream: Boolean,
    // up to 4 sequences to stop generating further tokens. default null
    stop: [String],
    // how many tokens to generate in completion. takes input tokens and generated tokens 
    max_tokens: Number, 
    // between -2 and 2. default 0. positive = penalize new tokens based on wether they appear in text so far, increasing likelihood to talk about new topics
    presence_penalty: Number,
    // between -2 and 2. default 0. positive: penalize new tokens based on existing frequency in text so far, decreasing likelihood to repeat the same line verbatim.
    frequency_penalty: Number,
    // modify likelihood of specified tokens appearing in the completion
    logit_bias: Map,
    // unique identifier representing end-user to help OpenAI monitor and detect abuse
    user: String, 
}, { timestamps: true })


export default promptSchema