import { io } from 'socket.io-client';

const urlConfig = {
	vps: 'http://144.126.145.81:3031',
	https: 'https://api.hsowin.vip',
};

const socket = io(urlConfig.https);

export default socket;
