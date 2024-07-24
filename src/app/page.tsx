// 'use client';

// import socket from '@/lib/socket';
// import { useEffect } from 'react';
export default function Home() {
	// useEffect(() => {
	// 	socket.on('connect', () => {
	// 		console.log('Connected');
	// 	});

	// 	socket.on('status-boss', (data) => {
	// 		console.log(data, 'Status boss');
	// 	});

	// 	socket.on('status-bot', (data) => {
	// 		console.log(data, 'status bot');
	// 	});

	// 	return () => {
	// 		socket.off('connect');
	// 		socket.off('status-boss');
	// 		socket.off('status-bot');
	// 	};
	// }, []);
	return (
		<div className="hero-content text-center">
			<div className="max-w-4xl">
				<h1 className="text-4xl font-bold">HỆ THỐNG MINI GAME</h1>
				<p className="py-6">
					Kiếm Vàng Ngọc <br /> Rồng Giao Dịch Tự Động Uy Tín
				</p>
				<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-warning btn-outline rounded-btn">
							Chưc Năng
						</div>
						<ul
							tabIndex={0}
							className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
							<li>
								<a>Item 1</a>
							</li>
							<li>
								<a>Item 2</a>
							</li>
						</ul>
					</div>
					<button className="btn btn-primary btn-outline rounded-btn">
						Hướng Dẫn
					</button>
					<button className="btn btn-primary btn-outline rounded-btn">
						Group Facebook
					</button>
					<button className="btn btn-primary btn-outline rounded-btn">
						Điểm Danh
					</button>
				</div>
			</div>
		</div>
	);
}
