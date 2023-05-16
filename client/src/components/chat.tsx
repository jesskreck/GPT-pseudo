import React, { useEffect, useState } from 'react'
import "./chat.css"


//REVIEW is this interface really necessary here?
interface Chat {
    _id: string;
    history: {
        prompts: {
            messages: {
                role: string,
                content: string;
            }[];
        };
        responses: {
            choices: {
                message: {
                    role: string;
                    content: string;
                };
            }[];
        };
    }[];
}

export default function Chat() {

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")


    const getChats = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/chats/completion");
            console.log(response);
            const data = await response.json();
            setChats(data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getChats()
    }, [])

    const sendPrompt = async () => {
        //REVIEW how can I make sure that the route is working everywhere? Proxy?
        if (selectedChat) {
            const response = await fetch("http://localhost:5000/api/chats/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt, chatId: selectedChat._id })
            })
            const result = await response.json()
            console.log('result :>> ', result);
        } else {
            const response = await fetch("http://localhost:5000/api/chats/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt })
            })
            const result = await response.json()
            console.log('result :>> ', result);
        }
    };

    const getResponse = async () => {
        const response = await fetch("http://localhost:5000/api/chats/completion");
        const data = await response.json();
        setResponse(data);
    };

    const handleSubmit = async () => {
        await sendPrompt();
        await getResponse();
    };


    return (
        <>
            <div className='sidebar'>
                <h2>Sidebar</h2>
                <button>+ New Chat</button>
                <ul className='history'>
                    {chats.map((chat) => (
                        <li key={chat._id}>
                            <button onClick={() => setSelectedChat(chat)}>{chat._id}</button>
                        </li>
                    ))}
                </ul>
            </div>


            <div className='chat-section'>
                <h2>Chat Section</h2>
                {selectedChat &&
                    selectedChat.history.map((historyItem, index) => (
                        <div key={index}>
                            {/* Display the prompts */}
                            {historyItem.prompts.messages.map((message, messageIndex) => (
                                <div key={message._id}>
                                    <span>{message.role}: </span>
                                    <span>{message.content}</span>
                                </div>
                            ))}

                            {/* Display the responses */}
                            {historyItem.responses.choices.map((choice, choiceIndex) => (
                                <div key={choice._id}>
                                    <span>{choice.message.role}: </span>
                                    <span>{choice.message.content}</span>
                                </div>
                            ))}
                        </div>
                    ))}

                <div className='chat-bottom'>
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                    <button id='submit' onClick={handleSubmit} >Submit</button>


                </div>

            </div>
        </>
    )
}