// npm imports
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai"

// local imports
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

// loads .env content into process.env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


//// MIDDLEWARE
// allow express application to handle JSON data - place before any route handlers that need access to parsed JSON data
app.use(express.json());

// enable express application to handle form data - place before any route handlers that need access to URL-encoded data 
app.use(express.urlencoded({extended: true}));

// control which external domains can access my API (Cross Origin Resource Sharing)
app.use(cors());



//// ENDPOINTS 
// base endpoint for userRouter. Defined as "/api" because necessary for deploying on Vercel
app.use("/api/users", userRouter)
app.use("/api/chats", chatRouter)


// MONGOOSE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connection to MongoDB established + Server is running on port" + port);
    });
  }).catch((err) => {
    console.log(err);
  });