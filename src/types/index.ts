export interface AccessTokenResponse {
    token: string;
}

export interface CreateJobResponse {
    job: {
        id: string;
    };
}

export interface JobResultsResponse {
    results: Array<{
        name: string;
        link: string;
    }>;
}

export interface JobRunConfig {
    taskTimeout: string;
    jobTimeout: string;
    isTestJob: boolean;
}

export interface JobParams {
    partitioner: {
        num_replicas: number;
    };
    assembler: Record<string, unknown>;
    app: {
        prompt: string;
    };
}