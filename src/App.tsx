import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import './styles/App.css';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [numReplicas, setNumReplicas] = useState(1);
    const [apiKey, setApiKey] = useState('');

    const handleGenerate = () => {
        // Logic to trigger image generation will be handled in the ImageGenerator component
    };

    return (
        <div className="app-container">
            <h1>SV Demo Night</h1>
            <div className="input-group">
                <label htmlFor="prompt">Prompt:</label>
                <input
                    type="text"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label htmlFor="numReplicas">Number of Replicas:</label>
                <select
                    id="numReplicas"
                    value={numReplicas}
                    onChange={(e) => setNumReplicas(Number(e.target.value))}
                >
                    {[...Array(10)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div className="input-group">
                <label htmlFor="apiKey">API Key:</label>
                <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </div>
            <button onClick={handleGenerate}>Generate</button>
            <ImageGenerator prompt={prompt} numReplicas={numReplicas} apiKey={apiKey} />
        </div>
    );
};

export default App;