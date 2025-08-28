import axios from 'axios';
import { AccessTokenResponse, CreateJobResponse, JobResultsResponse } from '../types';

const BASE_URL = 'https://api.bytenite.com/v1';

export const fetchAccessToken = async (apiKey: string): Promise<string> => {
    const response = await axios.post<AccessTokenResponse>(`${BASE_URL}/auth/access_token`, {
        apiKey: apiKey
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return response.data.token;
};

export const createJob = async (accessToken: string, prompt: string, numReplicas: number): Promise<CreateJobResponse> => {
    const response = await axios.post<CreateJobResponse>(`${BASE_URL}/customer/jobs`, {
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
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': accessToken
        }
    });
    return response.data;
};

export const runJob = async (accessToken: string, jobId: string): Promise<void> => {
    await axios.post(`${BASE_URL}/customer/jobs/${jobId}/run`, {
        config: {
            taskTimeout: "3600",
            jobTimeout: "84200",
            isTestJob: false
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': accessToken
        }
    });
    
    // Wait 1 second before polling as specified in requirements
    await new Promise(resolve => setTimeout(resolve, 1000));
};

export const pollResults = async (accessToken: string, jobId: string): Promise<JobResultsResponse['results']> => {
    const maxAttempts = 120; // 2 minutes max polling
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await axios.get<JobResultsResponse>(`${BASE_URL}/customer/jobs/${jobId}/results`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': accessToken
                }
            });
            
            if (response.data.results && response.data.results.length > 0) {
                return response.data.results;
            }
        } catch (error: any) {
            // If it's a 404 or similar, the job might not be ready yet
            if (error.response?.status !== 404) {
                throw error;
            }
        }
        
        // Wait 1 second before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }
    
    throw new Error('Job results not available after polling timeout');
};