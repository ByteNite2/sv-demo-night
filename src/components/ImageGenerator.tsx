import React, { useState } from 'react';
import { fetchAccessToken, createJob, runJob, pollResults } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ImageGallery from './ImageGallery';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [numReplicas, setNumReplicas] = useState(1);
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingStatus, setLoadingStatus] = useState('');

    // Check if we're using CORS proxy
    const isUsingProxy = window.location.hostname === 'bytenite2.github.io';

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }
        if (!apiKey.trim()) {
            setError('Please enter your API key');
            return;
        }

        setLoading(true);
        setError(null);
        setImages([]);

        try {
            setLoadingStatus('Authenticating...');
            const accessToken = await fetchAccessToken(apiKey);
            
            setLoadingStatus('Creating job...');
            const jobData = await createJob(accessToken, prompt, numReplicas);
            const jobId = jobData.job.id;

            setLoadingStatus('Starting generation...');
            await runJob(accessToken, jobId);
            
            setLoadingStatus('Generating images...');
            const results = await pollResults(accessToken, jobId);

            if (results && results.length > 0) {
                // For now, we'll just use the download links directly
                // In a real implementation, you'd download and extract the zip
                const imageLinks = results.map((result: any) => result.link);
                setImages(imageLinks);
                setLoadingStatus('');
            } else {
                setError('No results found');
            }
        } catch (err: any) {
            console.error('Error generating images:', err);
            setError(err.response?.data?.message || 'An error occurred while generating images.');
        } finally {
            setLoading(false);
            setLoadingStatus('');
        }
    };

    return (
        <div className="image-generator">
            {isUsingProxy && (
                <div className="cors-warning">
                    <p><strong>⚠️ Demo Mode:</strong> This app uses a CORS proxy for demonstration purposes. 
                    For production use, ByteNite API should be configured to allow your domain.</p>
                </div>
            )}
            
            <div className="form-container">
                <div className="input-group">
                    <label htmlFor="prompt">Prompt:</label>
                    <input
                        type="text"
                        id="prompt"
                        className="input-field"
                        placeholder="Enter your image description..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="numReplicas">Number of Images:</label>
                    <select
                        id="numReplicas"
                        className="select-field"
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
                        type="password"
                        id="apiKey"
                        className="input-field"
                        placeholder="Enter your ByteNite API key..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
                
                <button 
                    className="generate-button" 
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Images'}
                </button>
            </div>

            {loading && <LoadingSpinner status={loadingStatus} />}
            {error && <div className="error-message">{error}</div>}
            {images.length > 0 && <ImageGallery images={images} />}
        </div>
    );
};

export default ImageGenerator;