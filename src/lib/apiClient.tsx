import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'http://144.126.145.81:3031',
	timeout: 1000,
	headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
