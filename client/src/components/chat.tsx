import React, { useEffect, useState } from 'react'
import "./chat.css"


interface Chat {
    title: string,
    _id: string;
    history: Dialogue[]
}

interface Dialogue {
    prompt: string,
    response: string,
    inContext: boolean,
}

interface Status{
    status: "idle" | "loading" | "success" | "error";
}

export default function Chat() {

    const [status, setStatus] = useState<Status>({ status: "idle" })
    const [chatTitles, setChatTitles] = useState([])
    const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")


    // First render of page
    useEffect(() => {
        getChatTitles()
    }, [])

    // Update screen logic
    // useEffect(() => {

    // }, [status])


    //REVIEW isnt it smarter to have all these functions in the backend - would save me from typing "Chat" model again. Or is it good practice to have this kind of double check?
    const getChatTitles = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/chats/completion");
            const data = await response.json();
            const chatTitles = data.map((chat: Chat) => chat.title);
            setChatTitles(chatTitles);
        } catch (error) {
            console.log("Failed to load chat titles");
            console.error(error)
        }
    }



    const handleSubmit = async () => {
        setStatus({ status: "loading" })
        try {
            //REVIEW how can I make sure that the route is working everywhere? Proxy?
            if (selectedChat) {
                const response = await fetch("http://localhost:5000/api/chats/completion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: prompt, chatId: selectedChat._id })
                })
                const result = await response.json()
                console.log('sendPrompt() result :>> ', result);
            } else {
                const response = await fetch("http://localhost:5000/api/chats/completion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: prompt })
                })
                const result = await response.json()
                console.log('result in frontend :>> ', result);
            }
            setStatus({ status: "success" })

        } catch (error) {
            console.error(error);
            setStatus({ status: "error" })
        }
    };


    const handleSelectChat = async (title: string) => {
        const chatTitle = title;
        try {
            //FIXME title in URL bad idea. Change for chat._id - find a way on how to click on title but get _id
            const response = await fetch(`http://localhost:5000/api/chats/completion/title/${chatTitle}`)
            const result = await response.json();

            console.log('result :>> ', result);

            // extract only desired props from fetch result
            const { title, _id, history } = result;

            // map over history array to only extract prompt(string), response(string) and inContext(boolean) from each dialogue item inside
            const historyExtract = history.map((dialogueItem: Dialogue) => {
                const { prompt, response, inContext } = dialogueItem;
                return { prompt, response, inContext };
            })

            // voila: set selectedChat to be our chatExtract! 
            const chatExtract: Chat = {
                title,
                _id,
                history: historyExtract
            };

            setSelectedChat(chatExtract);

        } catch (error) {
            console.error(error)
        }
    }

    const handleNewChat = () => {
        setSelectedChat(undefined)
    }


    return (
        <>
            <div className='sidebar'>
                <h2>Sidebar</h2>
                <button onClick={handleNewChat}>+ New Chat</button>
                <ul className='history'>
                    {chatTitles.map((title, index) => (
                        <li key={index}>
                            <button onClick={() => handleSelectChat(title)}>{title}</button>
                        </li>
                    ))}
                </ul>
            </div>


            <div className='chat-section'>
                <h2>Chat Section</h2>

                {selectedChat ? <h4>Selected Chat: {selectedChat.title}</h4> : <h4>no chat selected</h4>}

                {selectedChat &&
                    selectedChat.history.map((dialogue, index) => (


                        <div key={index} className='dialogue'>

                            <div>Prompt: {dialogue.prompt}</div>
                            <div>Response: {dialogue.response}</div>
                        </div>
                    ))}

                <div className='chat-bottom'>
                    {status.status === "loading" ? <p>loading...</p> : null}
                    {status.status === "error" ? <p>An error occurred</p> : null}
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                    <button id='submit' onClick={handleSubmit} >Submit</button>


                </div>

            </div>
        </>
    )
}


