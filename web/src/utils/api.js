import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem('ums_user');
        if (savedUser) {
            const { token } = JSON.parse(savedUser);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
