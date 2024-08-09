import axios from 'axios';

const urlConfig = {
	dev: 'http://localhost:3031',
	vps: 'http://144.126.145.81:3031',
	https: 'https://api.hsowin.vip',
};

const apiClient = axios.create({
	baseURL: urlConfig.https,
	// timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default apiClient;
