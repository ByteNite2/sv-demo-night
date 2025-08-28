import axios from 'axios';
import { AccessTokenResponse, CreateJobResponse, JobResultsResponse } from '../types';

// Use Vercel API routes (will be /api/* when deployed)
const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api';
  }
  return '/api';
};

export const fetchAccessToken = async (apiKey: string): Promise<string> => {
  try {
    console.log('Calling Vercel auth API...');
    
    const response = await axios.post<AccessTokenResponse>(`${getApiBase()}/auth`, {
      apiKey: apiKey.trim()
    });
    
    console.log('Authentication successful!');
    return response.data.token;
  } catch (error: any) {
    console.error('Auth error:', error);
    
    // Better error message extraction
    let errorMessage = 'Unknown error';
    if (error.response?.data) {
      if (typeof error.response.data.error === 'string') {
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data.details === 'string') {
        errorMessage = error.response.data.details;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else {
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(`Authentication failed: ${errorMessage}`);
  }
};

export const createJob = async (accessToken: string, prompt: string, numReplicas: number): Promise<CreateJobResponse> => {
  try {
    console.log('Creating job via Vercel API...');
    
    const response = await axios.post<CreateJobResponse>(`${getApiBase()}/create-job`, {
      accessToken,
      prompt,
      numReplicas
    });
    
    console.log('Job created successfully!');
    return response.data;
  } catch (error: any) {
    console.error('Job creation error:', error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Job creation failed: ${errorMessage}`);
  }
};

export const runJob = async (accessToken: string, jobId: string): Promise<void> => {
  try {
    console.log('Running job via Vercel API...');
    
    await axios.post(`${getApiBase()}/run-job`, {
      accessToken,
      jobId
    });
    
    console.log('Job started successfully!');
    
    // Wait 1 second before polling as specified in requirements
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error: any) {
    console.error('Job run error:', error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Job execution failed: ${errorMessage}`);
  }
};

export const pollResults = async (
  accessToken: string, 
  jobId: string, 
  onProgress?: (attempt: number, maxAttempts: number) => void
): Promise<JobResultsResponse['results']> => {
  const maxAttempts = 120; // 2 minutes max polling
  let attempts = 0;

  console.log(`Starting to poll for job results: ${jobId}`);

  while (attempts < maxAttempts) {
    try {
      if (onProgress) {
        onProgress(attempts + 1, maxAttempts);
      }
      
      const response = await axios.get<JobResultsResponse>(
        `${getApiBase()}/get-results?accessToken=${encodeURIComponent(accessToken)}&jobId=${encodeURIComponent(jobId)}`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        console.log(`✅ Job completed! Found ${response.data.results.length} results`);
        return response.data.results;
      }
      
      console.log('Job not yet complete, continuing to poll...');
      
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.error || error.message;
      
      console.log(`Polling attempt ${attempts + 1} - Status: ${status}, Message: ${message}`);
      
      // These are expected responses while job is running - not errors
      if (
        status === 404 || // Job not found yet
        status === 400 || // Bad request (job not ready)
        status === 500 || // Internal server error (job still processing)
        status === 202 || // Accepted (job still processing)
        message?.includes('not yet been completed') ||
        message?.includes('job has not yet been completed') ||
        message?.includes('still processing') ||
        message?.includes('Internal Server Error')
      ) {
        console.log('Job still processing, continuing to poll...');
      } else {
        console.error(`Unexpected error during polling:`, error);
        throw new Error(`Polling failed with unexpected error: ${message} (Status: ${status})`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error(`Job results not available after ${maxAttempts} seconds of polling. The job may still be processing.`);
};