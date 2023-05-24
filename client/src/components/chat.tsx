import React, { useEffect, useState } from 'react'
import "./chat.css"


interface Chat {
    title: string,
    _id: string;
    history?: Dialogue[]
}

interface Dialogue {
    prompt: string,
    response: string,
    temp: number,
    topP: number,
    promptTokens: number,
    responseTokens: number,
    totalTokens: number,
    inContext: boolean,
}

interface Status {
    status: "idle" | "loading" | "success" | "error";
}

interface PromptMode {
    name: string,
    temp: number,
    topP: number
}

export default function Chat() {

    const [status, setStatus] = useState<Status>({ status: "idle" })
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)
    const [prompt, setPrompt] = useState("")
    const [temp, setTemp] = useState(1)
    const [topP, setTopP] = useState(1)
    const [advanced, setAdvanced] = useState(false)


    const promptModes: PromptMode[] = [
        { name: "default", temp: 1, topP: 1 },
        { name: "code generation", temp: 0.2, topP: 0.1 },
        { name: "creative writing", temp: 0.7, topP: 0.8 },
        { name: "chatbot responses", temp: 0.5, topP: 0.5 },
        { name: "code comment generation", temp: 0.3, topP: 0.2 },
        { name: "data analysis scripting", temp: 0.2, topP: 0.1 },
        { name: "exploratory code writing", temp: 0.6, topP: 0.7 }
    ]


    // First render of page
    useEffect(() => {
        getFirstChats()
    }, [])

    //TODO create listener here - SSE connection
    // Update screen logic
    // useEffect(() => {

    // }, [status])


    //REVIEW isnt it smarter to have all these functions in the backend - would save me from typing "Chat" model again. Or is it good practice to have this kind of double check?
    const getFirstChats = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/chats/completion");
            const data = await response.json();
            const chats = data.map((chat: Chat) => ({ _id: chat._id, title: chat.title }));
            console.log('chats :>> ', chats);
            setChats(chats);
        } catch (error) {
            console.log("Failed to load first chat info");
            console.error(error)
        }
    }



    const handleSubmit = async () => {
        setStatus({ status: "loading" })
        try {
            const requestBody = selectedChat
                ? { prompt: prompt, chatId: selectedChat._id, temp: temp, topP: topP }
                : { prompt: prompt, temp: temp, topP: topP }

            const response = await fetch("http://localhost:5000/api/chats/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            })
            const result = await response.json();
            console.log('handleSubmit() result :>> ', result);
            setStatus({ status: "success" })

        } catch (error) {
            console.error(error);
            setStatus({ status: "error" })
        }
    };


    const handleSelectChat = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/chats/completion/id/${id}`)
            console.log('response :>> ', response);
            const result = await response.json();

            console.log('result :>> ', result);

            // extract only desired props from fetch result
            const { title, _id, history } = result;

            // map over history array to only extract prompt(string), response(string) and inContext(boolean) from each dialogue item inside
            const historyExtract = history.map((dialogueItem: Dialogue) => {
                const { prompt, response, temp, topP, inContext, promptTokens, responseTokens, totalTokens } = dialogueItem;
                  console.log('temp :>> ', temp);
            console.log('topP :>> ', topP);
            console.log('inContext :>> ', inContext);
                return { prompt, response, temp, topP, inContext, promptTokens, responseTokens, totalTokens };
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

    const handleModeClick = (mode: PromptMode) => {
        setTemp(mode.temp);
        setTopP(mode.topP);
    }

    return (
        <>
            <div className='sidebar'>
                <h2>Sidebar</h2>
                <button onClick={handleNewChat}>+ New Chat</button>
                <ul className='history'>
                    {chats &&
                        chats.map((chat: Chat) => (
                            <li key={chat._id}>
                                <button onClick={() => handleSelectChat(chat._id)}>{chat.title}</button>
                            </li>
                        ))}
                </ul>
            </div>


            <div className='chat-grid'>
                <div className="chat_header">
                    <h2>Chat Section</h2>
                    {selectedChat ? <h4>Selected Chat: "{selectedChat.title}[...]"</h4> : <h4>no chat selected</h4>}
                </div>

                <div className="chat_dialogues">
                    {selectedChat &&
                        //null-check (= "?") for selectedChat.history = if selectedChat is defined but selectedChat.history is undefined, mapping won't be performed
                        // if history would not be an optional property in the Chat interface, we would not need the null-check! remember: it
                        selectedChat.history?.map((dialogue, index) => (
                            <div key={index} className='dialogue-container'>
                                <div className='dialogue'>
                                    <div className='prompt'>Prompt: {dialogue.prompt}</div>
                                    <div className="token">{dialogue.promptTokens}</div>
                                    <div className='response'>Response: {dialogue.response}</div>
                                    <div className="token">{dialogue.responseTokens}</div>
                                </div>
                                <span className="token">{dialogue.totalTokens}</span>
                                {temp === undefined && topP === undefined
                                    ? null
                                    : <span className="parameter">Parameters: Temp {dialogue.temp}, Top P {dialogue.topP}</span>
                                }
                            </div>
                        ))}
                </div>

                <div className='chat_bottom'>
                    {status.status === "loading" ? <p>loading...</p> : null}
                    {status.status === "error" ? <p>An error occurred</p> : null}
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}></textarea>
                    <button id='submit' onClick={handleSubmit} >Submit</button>

                    <div className="prompt-mode">
                        <h3>Prompt Modes:</h3>
                        <div className="button-group">
                            {promptModes.map((mode) => (
                                <button
                                    key={mode.name}
                                    onClick={() => handleModeClick(mode)}
                                >{mode.name}</button>
                            ))}

                            <input
                                type="checkbox"
                                className='radio'
                                name='promptMode'
                                id='advancedMode'
                                checked={advanced}
                                onChange={() => setAdvanced(!advanced)}
                            />
                            <label htmlFor="advancedMode">Advanced Mode</label>
                        </div>

                        <div className="advanced">
                            <label>Temperature: {temp}</label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={temp}
                                disabled={!advanced}
                                onChange={(e) => setTemp(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <label>TopP: {topP}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={topP}
                                disabled={!advanced}
                                onChange={(e) => setTopP(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


