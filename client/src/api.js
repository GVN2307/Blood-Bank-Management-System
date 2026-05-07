import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3333/api' 
    : '/api';

const api = axios.create({
    baseURL: API_BASE_URL
});

// Add a request interceptor for tokens
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
