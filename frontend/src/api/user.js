import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:9000',
    withCredentials: true
});

export const signup = (userData) => API.post('/user/signup', userData);

export const login = (userData) => API.post('/user/login', userData);

export const getProfile = () => API.get('/user/profile');

export const logout = () => API.post('/user/logout');
