import axios from 'axios';
import { AccessTokenResponse, CreateJobResponse, JobResultsResponse } from '../types';

const BASE_URL = 'https://api.bytenite.com/v1';

// Multiple CORS proxy options
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://proxy.cors.sh/',
    'https://cors-anywhere.herokuapp.com/'
];

let currentProxyIndex = 0;

// For demo purposes, we'll use a CORS proxy
// In production, the ByteNite API should be configured to allow your domain
const getProxiedUrl = (url: string) => {
    // Only use proxy if we're in production (GitHub Pages)
    if (window.location.hostname === 'bytenite2.github.io') {
        const proxy = CORS_PROXIES[currentProxyIndex];
        return `${proxy}${encodeURIComponent(url)}`;
    }
    return url;
};

const tryNextProxy = () => {
    currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
};

export const fetchAccessToken = async (apiKey: string): Promise<string> => {
    const maxRetries = CORS_PROXIES.length;
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post<AccessTokenResponse>(
                getProxiedUrl(`${BASE_URL}/auth/access_token`), 
                {
                    apiKey: apiKey
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
            return response.data.token;
        } catch (error: any) {
            console.error(`Auth error with proxy ${CORS_PROXIES[currentProxyIndex]}:`, error);
            lastError = error;
            
            // If this isn't the last attempt, try next proxy
            if (attempt < maxRetries - 1) {
                tryNextProxy();
                console.log(`Trying next proxy: ${CORS_PROXIES[currentProxyIndex]}`);
                continue;
            }
        }
    }
    
    // If all proxies failed, throw the last error
    throw new Error(`Authentication failed with all CORS proxies. Last error: ${lastError.response?.data?.message || lastError.message}`);
};

export const createJob = async (accessToken: string, prompt: string, numReplicas: number): Promise<CreateJobResponse> => {
    try {
        const response = await axios.post<CreateJobResponse>(
            getProxiedUrl(`${BASE_URL}/customer/jobs`), 
            {
                templateId: "img-gen-diffusers-flux-gpu-template",
                description: "This job generates variations of images out of the same prompt using Flux Schnell.",
                name: "Job with img-gen-diffusers-flux-gpu-template",
                params: {
                    partitioner: {
                        num_replicas: numReplicas
                    },
                    assembler: {},
                    app: {
                        prompt: prompt
                    }
                }
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': accessToken
                },
                timeout: 15000 // 15 second timeout
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Job creation error:', error);
        throw new Error(`Job creation failed: ${error.response?.data?.message || error.message}`);
    }
};

export const runJob = async (accessToken: string, jobId: string): Promise<void> => {
    try {
        await axios.post(
            getProxiedUrl(`${BASE_URL}/customer/jobs/${jobId}/run`), 
            {
                config: {
                    taskTimeout: "3600",
                    jobTimeout: "84200",
                    isTestJob: false
                }
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': accessToken
                },
                timeout: 15000 // 15 second timeout
            }
        );
        
        // Wait 1 second before polling as specified in requirements
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
        console.error('Job run error:', error);
        throw new Error(`Job execution failed: ${error.response?.data?.message || error.message}`);
    }
};

export const pollResults = async (accessToken: string, jobId: string): Promise<JobResultsResponse['results']> => {
    const maxAttempts = 120; // 2 minutes max polling
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await axios.get<JobResultsResponse>(
                getProxiedUrl(`${BASE_URL}/customer/jobs/${jobId}/results`), 
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': accessToken
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
            
            if (response.data.results && response.data.results.length > 0) {
                return response.data.results;
            }
        } catch (error: any) {
            console.error(`Polling attempt ${attempts + 1} failed:`, error);
            // If it's a 404 or similar, the job might not be ready yet
            if (error.response?.status !== 404) {
                throw new Error(`Polling failed: ${error.response?.data?.message || error.message}`);
            }
        }
        
        // Wait 1 second before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }
    
    throw new Error('Job results not available after polling timeout');
};