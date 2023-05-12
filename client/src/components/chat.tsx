import React from 'react'
import "./chat.css"



export default function Chat() {


    const getPrompt = async () => {
        const configuration = {
            method: "POST",
            body: JSON.stringify({
                message: "hello"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch("/prompt", configuration)
            const data = await response.json()
            console.log(data);
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            <div className='sidebar'>
                <h2>Sidebar</h2>
                <button>+ New Chat</button>
                <ul className='history'>
                    <li>chats will go here</li>
                    <li>chats will go here</li>
                </ul>
            </div>


            <div className='chat-section'>
                <h2>Chat Section</h2>
                <ul className='feed'>
                    <p>messages will go here</p>
                </ul>

                <div className='chat-bottom'>
                    <textarea name="prompt-text" id="prompt-text"></textarea>
                    <button id='submit' onClick={getPrompt} >Submit</button>


                </div>

            </div>
        </>
    )
}