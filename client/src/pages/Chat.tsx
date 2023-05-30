import { useContext, useEffect, useRef, useState } from 'react'
import { PromptModes } from '../components/PromptModes';
import { AuthContext } from '../contexts/AuthContext';
import { PromptContext } from '../contexts/PromptContext';
import "./chat.css"
import Spinner from '../components/Spinner1';




export default function Chat() {

    const { user } = useContext(AuthContext)
    const { prompt, setPrompt, temp, topP } = useContext(PromptContext)

    const [status, setStatus] = useState<Status>({ status: "idle" })

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)

    const chatDialoguesRef = useRef<null | HTMLDivElement>(null)

    // LOAD CHAT TITLES WHEN COMPONENT MOUNTS 
    useEffect(() => {
        getFirstChats()
    }, [])

    //TODO LISTEN (SSE connection) TO SERVER TO UPDATE SCREEN AUTOMATICALLY WHEN NEW DATA AVAILABLE
    // useEffect(() => {
    // }, [status])


    //REVIEW isnt it smarter to have all these functions in the backend - would save me from typing "Chat" model again. Or is it good practice to have this kind of double check?
    const getFirstChats = async () => {
        const userId = user?._id;
        try {
            const response = await fetch(`http://localhost:5000/api/chats/completion?userId=${userId}`);
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
        setStatus({ status: "loading" });
        if (user) try {
            const requestBody = selectedChat
                //if there is a chat - send chatID to add dialogue to existing chat
                ? { prompt: prompt, temp: temp, topP: topP, chatId: selectedChat._id, }
                //if there is no chat - send owner to create new chat
                : { prompt: prompt, temp: temp, topP: topP, owner: user._id }

            const response = await fetch("http://localhost:5000/api/chats/completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            })
            const result = await response.json();
            console.log(result);
            setStatus({ status: "success" })

            //how to update? I manually send back the success:true and the chatId (in backend after response is saved in MongoDB)
            if (result.success) {
                handleSelectChat(result.chatId);
            }

        } catch (error) {
            console.error(error);
            setStatus({ status: "error" })
        }
    };


    const handleSelectChat = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/chats/completion/id/${id}`)
            const result = await response.json();

            // extract only desired props from fetch result
            const { title, _id, history } = result;

            // map over history array to only extract prompt(string), response(string) and inContext(boolean) from each dialogue item inside
            const historyExtract = history.map((dialogueItem: Dialogue) => {
                const { prompt, response, temp, topP, inContext, promptTokens, responseTokens, totalTokens } = dialogueItem;
                return { prompt, response, temp, topP, inContext, promptTokens, responseTokens, totalTokens };
            })
            // voila: set selectedChat to be our chatExtract! 
            const chatExtract: Chat = {
                title,
                _id,
                history: historyExtract
            };
            setSelectedChat(chatExtract);
            scrollToBottom();
        } catch (error) {
            console.error(error)
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



    const handleNewChat = () => {
        setSelectedChat(undefined)
    }

    const scrollToBottom = () => {
        chatDialoguesRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                    {status.status === "loading" ? <Spinner /> : null}
                    {status.status === "error" ? <p>An error occurred</p> : null}
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}></textarea>
                    <button id='submit' onClick={handleSubmit} >Submit</button>

                    <PromptModes />

                </div>
            </div>
        </>
    )
}


