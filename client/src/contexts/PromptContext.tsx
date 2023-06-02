import { createContext, useState } from "react";

interface PromptContextI {
    prompt: string,
    setPrompt: (e: string) => void,
    persona: Persona,
    setPersona: (e: Persona) => void,
    temp: number,
    setTemp: (e: number) => void,
    topP: number,
    setTopP: (e: number) => void,
}

const initalPromptContext: PromptContextI = {
    prompt: "",
    setPrompt: () => console.log("setPrompt called outside of PromptContext"),
    persona: {name: "", message: ""},
    setPersona: () => console.log("setPersona called outside of PromptContext"),
    temp: 0,
    setTemp: () => console.log("setTemp called outside of PromptContext"),
    topP: 0,
    setTopP: () => console.log("setTopP called outside of PromptContext"),
}

export const PromptContext = createContext<PromptContextI>(initalPromptContext)

//NOTE: type props as children react.reactnode typed in index.d.ts
export const PromptProvider = ({ children }: props) => {

    const [prompt, setPrompt] = useState("");
    const [persona, setPersona] = useState<Persona>({name: "", message: ""});
    const [temp, setTemp] = useState(0);
    const [topP, setTopP] = useState(0);


    return (
        <PromptContext.Provider value={{ prompt, setPrompt, persona, setPersona, temp, setTemp, topP, setTopP }}>
            {children}
        </PromptContext.Provider>
    )
}