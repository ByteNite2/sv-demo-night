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

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setImages([]);

        try {
            const accessToken = await fetchAccessToken(apiKey);
            const jobResponse = await createJob(accessToken, prompt, numReplicas);
            const jobId = jobResponse.job.id;

            await runJob(accessToken, jobId);
            const results = await pollResults(accessToken, jobId);

            const imageLinks = results.results.map(result => result.link);
            setImages(imageLinks);
        } catch (err) {
            setError('An error occurred while generating images.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>SV Demo Night - Image Generator</h1>
            <input
                type="text"
                placeholder="Enter your prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <select value={numReplicas} onChange={(e) => setNumReplicas(Number(e.target.value))}>
                {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
            <button onClick={handleGenerate}>Generate</button>
            {loading && <LoadingSpinner />}
            {error && <p>{error}</p>}
            {images.length > 0 && <ImageGallery images={images} />}
        </div>
    );
};

export default ImageGenerator;