import axios from "@/utils/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const assetStatusLabels: Record<string, string> = {
  in_use: 'In Use',
  maintenance: 'Maintenance',
  available: 'Available',
};

// DATACENTER

export interface Datacenter {
  id: number;
  name: string;
  location: string;
}

export const getAllDatacenters = (token: string): Promise<{ data: Datacenter[] }> => {
  return axios.get(`${API_URL}/datacenters/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDatacenterById = (token: string, dcId: number): Promise<{ data: Datacenter }> => {
  return axios.get(`${API_URL}/datacenters/${dcId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createDatacenter = (
  token: string,
  dcData: Omit<Datacenter, 'id'>
): Promise<{ data: Datacenter }> => {
  return axios.post(`${API_URL}/datacenters/`, dcData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateDatacenter = (
  token: string,
  dcId: number,
  updatedData: Partial<Datacenter>
): Promise<{ data: Datacenter }> => {
  return axios.patch(`${API_URL}/datacenters/${dcId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDatacenter = (
  token: string,
  dcId: number
): Promise<void> => {
  return axios.delete(`${API_URL}/datacenters/${dcId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// SERVER

export interface Server {
  id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  cpu: number;
  ram: number;
  storage: number;
  ip_address: string;
  datacenter: number;
}

export const getAllServers = (token: string): Promise<{ data: Server[] }> => {
  return axios.get(`${API_URL}/servers/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createServer = (
  token: string,
  serverData: Omit<Server, 'id'>
): Promise<{ data: Server }> => {
  return axios.post(`${API_URL}/servers/`, serverData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateServer = (
  token: string,
  serverId: number,
  updatedData: Partial<Server>
): Promise<{ data: Server }> => {
  return axios.patch(`${API_URL}/servers/${serverId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteServer = (
  token: string,
  serverId: number
): Promise<void> => {
  return axios.delete(`${API_URL}/servers/${serverId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// DISK ARRAY

export interface Disk {
  id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  storage: number;
  datacenter: number;
}

export const getAllDisks = (token: string): Promise<{ data: Disk[] }> => {
  return axios.get(`${API_URL}/disk-arrays/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createDisk = (
  token: string,
  diskData: Omit<Disk, 'id'>
): Promise<{ data: Disk }> => {
  return axios.post(`${API_URL}/disk-arrays/`, diskData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateDisk = (
  token: string,
  diskId: number,
  updatedData: Partial<Disk>
): Promise<{ data: Disk }> => {
  return axios.patch(`${API_URL}/disk-arrays/${diskId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDisk = (
  token: string,
  diskId: number
): Promise<void> => {
  return axios.delete(`${API_URL}/disk-arrays/${diskId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// MAINTENANCE RECORD

export interface MaintenanceRecord {
  id: number;
  title: string;
  description: string;
  performed_at: Date;
  object_id?: number;
  content_type?: number;
  resource_repr: string;
  datacenter: number;
}

export interface MaintenanceResource {
  id: number;
  name: string;
  type: string;
  content_type_id: number;
}

export const getRecordsByDatacenter = (token: string, dcId: number): Promise<{ data: any }> => {
  return axios.get(`${API_URL}/maintenance/by-datacenter/${dcId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const getResourcesByDatacenter = (
  token: string,
  dcId: number
): Promise<{ data: MaintenanceResource[] }> => {
  return axios.get(`${API_URL}/datacenters/${dcId}/resources/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createMaintenanceRecord = (
  token: string,
  mrData: {
    title: string;
    description: string;
    performed_at: string | Date;
    datacenter: number;
    object_id: number;
    content_type: number;
  }
): Promise<{ data: MaintenanceRecord }> => {
  return axios.post(`${API_URL}/maintenance/`, mrData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};


export const updateMaintenanceRecord = (
  token: string,
  mrId: number,
  updatedData: Partial<MaintenanceRecord>
): Promise<{ data: MaintenanceRecord }> => {
  return axios.patch(`${API_URL}/maintenance/${mrId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteMaintenanceRecord = (
  token: string,
  mrId: number
): Promise<void> => {
  return axios.delete(`${API_URL}/maintenance/${mrId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

