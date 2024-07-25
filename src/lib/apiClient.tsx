import axios from 'axios';

const urlConfig = {
	dev: 'localhost',
	vps: '144.126.145.81',
};

const apiClient = axios.create({
	baseURL: `http://${urlConfig.vps}:3031`,
	// timeout: 1000,
	headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
