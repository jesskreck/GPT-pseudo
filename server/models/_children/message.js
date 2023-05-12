import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    // content of message
    content: { type: String, required: true },
    // name of author
    name: { type: String },
    context: { type: Boolean, default: true }
}, { timestamps: true })

export default messageSchema