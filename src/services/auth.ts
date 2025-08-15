import axios from "@/utils/axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type LoginDto = {
  username: string
  password: string
}

export const login = async (dto: LoginDto) => {
  const res = await axios.post(`${API_URL}/login/`, dto);
  return res;
}

export const forgotPassword = async (email: string) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, {
    token,
    newPassword,
  });
  return res;
};

export const getMe = (token: string) => {
  return axios.get(`${API_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};