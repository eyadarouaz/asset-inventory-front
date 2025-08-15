import axios from "@/utils/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type UserRole = 'operator' | 'admin';

export const userRoleLabels: Record<UserRole, string> = {
  operator: 'Operator',
  admin: 'Admin',
};

export const userStatusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    status: string;
}

export const getAllUsers = (token: string) => {
  return axios.get(`${API_URL}/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (
  token: string,
  data: Omit<User, 'id'>
): Promise<{ data: User }> => {
  return axios.post(`${API_URL}/users/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateUser = (
  token: string,
  userId: number,
  updatedData: Partial<User>
): Promise<{ data: User }> => {
  return axios.patch(`${API_URL}/users/${userId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const deleteUser = (
  token: string,
  userId: number
): Promise<void> => {
  return axios.delete(`${API_URL}/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};