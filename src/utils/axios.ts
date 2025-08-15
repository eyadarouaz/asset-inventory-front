import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false,
});

// Intercept all responses
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            if (typeof window !== "undefined") {
                // Remove token from localStorage or store
                localStorage.removeItem("auth-storage");
                window.location.href = '/signin';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
