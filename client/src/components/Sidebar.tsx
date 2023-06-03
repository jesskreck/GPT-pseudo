import React from 'react'
import { ChatHistoryItem } from './ChatHistoryItem'

interface SidebarProps {
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>,
    chats: Chat[]
}

export const Sidebar = ({ setSelectedChat, chats }: SidebarProps) => {


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
            // scrollToBottom();
        } catch (error) {
            console.error(error)
        }
    }

    const handleNewChat = () => {
        setSelectedChat(undefined)
    }
    return (
        <div className='sidebar'>
            <h2>Sidebar</h2>
            <button onClick={handleNewChat}>+ New Chat</button>
            <ul className='history-list'>
                {chats &&
                    chats.map((chat: Chat) => (
                        <ChatHistoryItem id={chat._id} title={chat.title}  handleSelectChat={handleSelectChat} />
                    ))}
            </ul>

        </div>
    )
}
