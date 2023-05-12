// npm imports
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai"

// local imports
import userRouter from "./routes/userRoutes.js";

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



// OPENAI API
//STUB - change /completions to actual route where fetch result is coming back
app.post("/prompt", async (req, res) => {
  // res.send("testing")
  // console.log(req.body);
  const configuration = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{ "role": "user", "content": req.body.input }]
    })
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", configuration)
    const data = await response.json()
    console.log(data);
    res.send(data)
  } catch (error) {
      console.error(error)
  }
})