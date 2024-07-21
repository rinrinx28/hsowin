'use client';

import socket from '@/lib/socket';
import { useEffect } from 'react';
export default function Home() {
	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected');
		});

		socket.on('status-boss', (data) => {
			console.log(data, 'Status boss');
		});

		socket.on('status-bot', (data) => {
			console.log(data, 'status bot');
		});

		return () => {
			socket.off('connect');
			socket.off('status-boss');
			socket.off('status-bot');
		};
	}, []);
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1>Hello World</h1>
		</main>
	);
}
