import axios from 'axios';

const BASE_URL = 'https://api.bytenite.com/v1';

export const fetchAccessToken = async (apiKey: string): Promise<string> => {
    const response = await axios.post(`${BASE_URL}/auth/access_token`, {
        apiKey: apiKey
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return response.data.token;
};

export const createJob = async (accessToken: string, prompt: string, numReplicas: number) => {
    const response = await axios.post(`${BASE_URL}/customer/jobs`, {
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
    return response.data.job.id;
};

export const runJob = async (accessToken: string, jobId: string) => {
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
};

export const pollResults = async (accessToken: string, jobId: string) => {
    const response = await axios.get(`${BASE_URL}/customer/jobs/${jobId}/results`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': accessToken
        }
    });
    return response.data.results;
};