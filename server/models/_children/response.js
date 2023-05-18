import mongoose from 'mongoose';
import messageSchema from './message.js'


const choicesSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  message: { type: messageSchema, required: true },
  finish_reason: { type: String, required: true },
});

const usageSchema = new mongoose.Schema({
  prompt_tokens: { type: Number, required: true },
  completion_tokens: { type: Number, required: true },
  total_tokens: { type: Number, required: true },
});

const responseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  object: { type: String, required: true },
  created: { type: Number, required: true },
  choices: [choicesSchema],
  usage: { type: usageSchema, required: true },
}, { timestamps: true });



export default responseSchema
