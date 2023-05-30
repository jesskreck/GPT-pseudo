import { useContext, useState } from 'react'
import { PromptContext } from '../contexts/PromptContext'

export const PromptModes = () => {


    const { temp, setTemp, topP, setTopP } = useContext(PromptContext)

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

    const handleModeClick = (mode: PromptMode) => {
        setTemp(mode.temp);
        setTopP(mode.topP);
    }

    return (
        <section className='prompt-mode'>
            <h3>Prompt Modes:</h3>
            <div className="button-group">
                {promptModes.map((mode) => (
                    <button
                        key={mode.name}
                        onClick={() => handleModeClick(mode)}
                    >{mode.name}</button>
                ))}
            </div>


           

            <div className="advanced">
                 <div>
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
        </section>
    )
}
