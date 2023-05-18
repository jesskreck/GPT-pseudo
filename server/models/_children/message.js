import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    // content of message
    content: { type: String, required: true },
}, { timestamp: true })

export default messageSchema