import axios from "@/utils/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DeploymentJob {
    id: number;
    name: string;
    vm_name: string;
    vm_count: number;
    cpu: number;
    memory: number;
    datastore: string;
    datacenter: number;
    cluster: number;
    network: number
}

export const getAllDeployments = (token: string): Promise<{ data: DeploymentJob[] }> => {
    return axios.get(`${API_URL}/deployments/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getDeploymentLogs = (token: string, jobId: number): Promise<{ logs: string }> => {
    return axios.get(`${API_URL}/deployments/${jobId}/logs/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(res => res.data);
};

export const createDeploymentJob = (
    token: string,
    data: Omit<DeploymentJob, 'id'>
): Promise<{ data: DeploymentJob }> => {
    return axios.post(`${API_URL}/deployments/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
