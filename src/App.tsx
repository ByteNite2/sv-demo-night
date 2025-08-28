import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <header>
                <h1>SV Demo Night</h1>
                <p>Generate amazing images using ByteNite's AI-powered Flux model</p>
            </header>
            <main>
                <ImageGenerator />
            </main>
        </div>
    );
};

export default App;