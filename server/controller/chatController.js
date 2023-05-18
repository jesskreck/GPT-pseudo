import Chat from "../models/chatModel.js"

const test = (req, res) => {
  res.send("chat is activated")
}



const sendPrompt = async (req, res) => {
    console.log('req.body.prompt :>> ', req.body.prompt);
    const configuration = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": req.body.prompt }]
      })
    };
    // 1st TryCatch to send prompt to OpenAI API
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", configuration);
      const fetchedData = await response.json();
      console.log('fetchedData from OpenAI API:>> ', fetchedData);
      console.log('fetchedData.choices[0].message :>> ', fetchedData.choices[0].message);

      // 2nd TryCatch to save fetch result in MongoDB
      if (response.ok) {
        try {
          const newDialogue = {
            prompt: req.body.prompt,
            response: fetchedData.choices[0].message.content,
            promptObject: JSON.parse(configuration.body),
            responseObject: fetchedData,
            inContext: true,
          };

          if (req.body.chatId) {
            const chatId = req.body.chatId;
            const existingChat = await Chat.findById(chatId);
            
            existingChat.history.push({
              ...newDialogue
            })
            await existingChat.save();
            res.status(200).json({ message: "Chat successfully UPDAPTED in MongoDB" })
          } else {
            const newChat = new Chat();
            newChat.title = fetchedData.choices[0].message.content.slice(0, 25);
            newChat.history.push({ ...newDialogue });
            await newChat.save();
            // OLD
            // await newChat.save({
            //   title: fetchedData.choices[0].message.content.slice(0, 25),
            //   history: [{...newDialogue}],
            // })
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
      const chats = await Chat.find()
      if (chats) {
        res.status(200).json(chats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  
const getSelectedChat = async (req, res) => {
  const title = req.params.title;
  try {
    const chat = await Chat.findOne({ title: title })
    res.status(200).json(chat)
  } catch (error) {
    console.error(error)
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