import Chat from "../models/chatModel.js"

const test = (req, res) => {
  res.send("chat is activated")
}



const sendPrompt = async (req, res) => {
  const configuration = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{ "role": "user", "content": req.body.prompt }],
      "temperature": req.body.temp,
      "top_p": req.body.topP 
    })
  };
  // 1st TryCatch to send prompt to OpenAI API
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", configuration);
    const fetchedData = await response.json();
    console.log('fetchedData from OpenAI API:>> ', fetchedData);
    console.log('fetchedData.choices[0].message :>> ', fetchedData.choices[0].message);

    // if we got response from API...
    if (response.ok) {

      // 2nd TryCatch to save fetch result in MongoDB
      try {

        // save all information from fetch + extract relevant information for frontend in specific props to have quicker access 
        //NOTE if you need more information on frontend, extract here first. dont forget to include in chatModel aka chat and dialogue schema
        const newDialogue = {
          // extracted from req+res
          prompt: req.body.prompt,
          response: fetchedData.choices[0].message.content,
          promptTokens: fetchedData.usage.prompt_tokens,
          responseTokens: fetchedData.usage.completion_tokens,
          totalTokens: fetchedData.usage.total_tokens,
          temp: req.body.temp,
          topP: req.body.topP,
          promptObject: JSON.parse(configuration.body),
          responseObject: fetchedData,

          // custom props added by me
          inContext: true,
        };

        // if prompt was send with chatID (if there was an existing chat..) add to doc in MongoDB
        if (req.body.chatId) {
          const chatId = req.body.chatId;

          //LINK MongoDB functions
          const existingChat = await Chat.findById(chatId);
          existingChat.history.push({ ...newDialogue });
          await existingChat.save();

          res.status(200).json({ message: "Chat successfully UPDAPTED in MongoDB" })
        }
        // otherwise create new doc in MongoDB
        else {
          const newChat = new Chat();
          console.log('req.body.owner :>> ', req.body.owner);

          //STUB title shown in history list is created here:
          newChat.title = req.body.prompt.slice(0, 25);
          newChat.owner = req.body.owner;          

          newChat.history.push({ ...newDialogue });
          await newChat.save();

          res.status(200).json({ message: "Chat successfully CREATED in MongoDB" })
        }
      } catch (error) {
        console.error("Error uploading data:", error);
        res.status(500).json({ error: "MongoDB data could not be uploaded successfully" })
      }
    }
  } catch (error) {
    console.error(error)
  }
}



const getAllChats = async (req, res) => {
  try {
    const ownerId = req.body.owner;
    const chats = await Chat.find({ owner: ownerId });
    if (chats) {
      res.status(200).json(chats)
    }
  } catch (error) {
    console.error(error)
  }
}


const getSelectedChat = async (req, res) => {
  const id = req.params.id;
  console.log('req :>> ', req);
  try {
    const chat = await Chat.findById(id)
    if (!chat) {
      return res.status(404).json({error: "Chat not found"})
    }
    res.status(200).json(chat)
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "internal server error"})
  }
  // try {
  //   const title = req.body.selectedChatTitle;
  //   const chat = await Chat.findOne({ title: title });
  //   res.status(200).json(chat)
  //   } catch (error) {
  //     console.error(error)
  //   }
}

export { test, getAllChats, sendPrompt, getSelectedChat }