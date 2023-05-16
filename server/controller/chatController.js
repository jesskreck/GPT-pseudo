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
            "messages": [{ "role": "user", "content": req.body.prompt }]
        })
    };
    // 1st TryCatch to send prompt to OpenAI API
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", configuration);
        const fetchedData = await response.json();

        // 2nd TryCatch to save fetch result in MongoDB
        try {
            const chatId = req.body.chatId;
            const chat = await Chat.findById(chatId);

            //STUB add real owner here
            if (chat) {
                chat.history.push({
                    prompts: JSON.parse(configuration.body),
                    response: fetchedData,
                    favorite: true,
                })
                await chat.save();
                res.status(200).json({ message: "Chat successfully UPDAPTED in MongoDB" })
            } else {
                const MongoDBdata = new Chat();
                MongoDBdata.history.push({
                    // prompts is expecting an object - since it was JSON.stringified before, need to parse it back here
                    prompts: JSON.parse(configuration.body),
                    responses: fetchedData,
                    favorite: true
                })
                await MongoDBdata.save();
                res.status(200).json({ message: "Chat successfully CREATED in MongoDB" })
            }
        } catch (error) {
            console.error("Error uploading data:", error);
            res.status(500).json({ error: "MongoDB data could not be uploaded successfully" })
        }

    } catch (error) {
        console.error(error)
    }
}



const getChats = async (req, res) => {
    try {
        const chats = await Chat.find()
        if (chats) {
            res.status(200).json(chats)
        }
    } catch (error) {
        console.error(error)
    }
}


export { test, getChats, sendPrompt }