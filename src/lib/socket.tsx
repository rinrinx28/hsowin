'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from './redux/hook';
import { updateMsgOne } from './redux/features/logs/messageLog';
import { updateHistoryServer } from './redux/features/logs/historyServer';
moment().format();

const urlConfig = {
	dev: 'http://localhost:3031',
	vps: 'http://144.126.145.81:3031',
	https: 'https://api.hsowin.vip',
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

		socket.on('noti-system', (data) => {
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

		socket.on('jackpot-up', (data) => {
			dispatch(updateHistoryServer(data));
		});

		return () => {
			socket.disconnect();
			socket.off('noti-bet');
			socket.off('message-user-re');
			socket.off('message-system-re');
			socket.off('jackpot-up');
			socket.off('noti-system');
		};
	}, [dispatch]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
