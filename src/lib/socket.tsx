'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import moment from 'moment';
moment().format();

const urlConfig = {
	vps: 'http://144.126.145.81:3031',
	https: 'https://api.hsowin.vip',
	local: 'http://localhost:3031',
};

const socket: Socket = io(urlConfig.https, {
	transports: ['websocket', 'polling'],
	withCredentials: true,
	reconnectionAttempts: 5, // Limit reconnection attempts
	// auth: {
	//   token: 'your-auth-token' // Ensure to pass a valid token
	// }
});

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	useEffect(() => {
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
