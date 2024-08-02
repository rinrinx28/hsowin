'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import moment from 'moment';
import { useAppDispatch } from './redux/hook';
import { updateMsgOne } from './redux/features/logs/messageLog';
moment().format();

const urlConfig = {
	vps: 'http://144.126.145.81:3031',
	https: 'wss://api.hsowin.vip',
	local: 'http://localhost:3031',
};

const socket: Socket = io(urlConfig.https, {
	path: '/socket.io/',
	transports: ['websocket'],
	secure: true,
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
	const dispatch = useAppDispatch();
	useEffect(() => {
		socket.connect();
		//TODO ———————————————[Handle event noti]———————————————
		socket.on('noti-bet', (data) => {
			dispatch(updateMsgOne(data));
		});

		socket.on('message-user-re', (data) => {
			if (data?.status) {
				dispatch(updateMsgOne(data?.msg));
			}
		});

		socket.on('message-system-re', (data) => {
			if (data?.status) {
				dispatch(updateMsgOne(data?.msg));
			}
		});

		return () => {
			socket.disconnect();
			socket.off('noti-bet');
			socket.off('message-user-re');
			socket.off('message-system-re');
		};
	}, [dispatch]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
