import { useContext, useEffect, useRef, useState } from 'react'
import { PromptModes } from '../components/PromptModes';
import { AuthContext } from '../contexts/AuthContext';
import { PromptContext } from '../contexts/PromptContext';
import "./chat.css"
import Spinner from '../components/Spinner1';
import { Personas } from '../components/Personas';
import { Sidebar } from '../components/Sidebar';



export default function Chat() {

    const { user } = useContext(AuthContext)
    const { prompt, setPrompt, persona, temp, topP } = useContext(PromptContext)

    const [status, setStatus] = useState<Status>({ status: "idle" })

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)

    const chatDialoguesRef = useRef<null | HTMLDivElement>(null)

    // LOAD CHAT TITLES WHEN COMPONENT MOUNTS 
    useEffect(() => {
        getFirstChats()
    }, [])



    const getFirstChats = async () => {
        const userId = user?._id;
        try {
            const response = await fetch(`http://localhost:5000/api/chats/completion?userId=${userId}`);
            const data = await response.json();
            //TODO move map to the backend
            const chats = data.map((chat: Chat) => ({ _id: chat._id, title: chat.title }));
            setChats(chats);
        } catch (error) {
            console.log("Failed to load first chat info");
            console.error(error)
        }
    }



    const handleSubmit = async () => {
        setStatus({ status: "loading" });

        if (user) {
            let requestBody;

            //SCENARIO 1: first chat, meaning there cant be any context anyway
            if (!selectedChat) {
                requestBody = {
                    prompt: prompt,
                    persona: persona,
                    // q: Why is persona not send through as an object?
                    // a: because the backend expects a string, not an object
                    // q: Where do I change that?
                    
                    temp: temp,
                    topP: topP,
                    owner: user._id
                }

                //...in any other case
            } else {

                //check if there are dialogues in context
                const dialoguesInContext = selectedChat?.history?.filter((dialogue) => dialogue.inContext) || [];
                console.log(dialoguesInContext);
                //SCENARIO 2: chat yes, context no
                if (dialoguesInContext.length === 0) {
                    requestBody = {
                        prompt: prompt,
                        temp: temp,
                        topP: topP,
                        chatId: selectedChat._id,
                    }
                }
                //SCENARIO 3: chat yes, context yes
                else {
                    requestBody = {
                        prompt: prompt,
                        temp: temp,
                        topP: topP,
                        chatId: selectedChat._id,
                        context: dialoguesInContext.map((dialogue) => `${dialogue.prompt} ${dialogue.response}`).join(" ")
                    }
                }
            }

            try {
                console.log("prompt being sent with", requestBody);
                const response = await fetch("http://localhost:5000/api/chats/completion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                })

                const result = await response.json();
                console.log(result);
                setStatus({ status: "success" })

                //update selected chat: I manually send back the success:true and the chatId (in backend after response is saved in MongoDB)
                if (result.success) {
                    handleSelectChat(result.chatId);
                }

            } catch (error) {
                console.error(error);
                setStatus({ status: "error" })
            }
        }
    }


   


    const toggleInContext = (index: number) => {
        setSelectedChat((prevSelectedChat) => {
            if (!prevSelectedChat || !prevSelectedChat.history) return prevSelectedChat;

            const updatedHistory = [...prevSelectedChat.history];
            updatedHistory[index].inContext = !updatedHistory[index].inContext;

            return { ...prevSelectedChat, history: updatedHistory };
        });
    };


   

    const scrollToBottom = () => {
        chatDialoguesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }



    return (

        <>
           <Sidebar setSelectedChat={setSelectedChat} chats={chats} />


            <div className='chat-grid'>
                <div className="chat_header">
                    <h2>Chat Section</h2>
                    {selectedChat ? <h4>Selected Chat: "{selectedChat.title}[...]"</h4> : <h4>no chat selected</h4>}
                </div>

                <div className={`chat_dialogues ${!selectedChat ? 'personas' : null}`}>
                    {!selectedChat &&
                        <Personas />
                    }

                    {selectedChat &&
                        //null-check (= "?") for selectedChat.history = if selectedChat is defined but selectedChat.history is undefined, mapping won't be performed
                        // if history would not be an optional property in the Chat interface, we would not need the null-check! remember: it
                        selectedChat.history?.map((dialogue, index) => (
                            <div key={index} className='dialogue-container' ref={chatDialoguesRef}>

                                <button
                                    className={`dialogue ${dialogue.inContext ? 'in-context' : ''}`}
                                    onClick={() => toggleInContext(index)}
                                >
                                    <div className='prompt'>{dialogue.prompt}</div>
                                    <div className="token">{dialogue.promptTokens}</div>
                                    <div className='response'>{dialogue.response}</div>
                                    <div className="token">{dialogue.responseTokens}</div>
                                </button>

                                <div className='parameter-container'>
                                    <span className='token'>Costs: {dialogue.totalTokens}</span>
                                    <span className='parameter'>Parameters: Temp {dialogue.temp}, Top P {dialogue.topP}</span>
                                </div>
                            </div>
                        ))}
                </div>

                <div className='chat_bottom'>
                    {status.status === "error" ? <p>An error occurred</p> : null}
                    <div className="input">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)}></textarea>
                        <div className='submit'>
                            {status.status === "loading" ? <Spinner /> : null}
                            {status.status === "success" || status.status === "idle" ? <button id='submit' onClick={handleSubmit} >💨</button> : null}
                        </div>
                    </div>

                    <PromptModes />

                </div>
            </div>
        </>
    )
}


