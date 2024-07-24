'use client';

import Chat from '@/components/icons/chat';
import Clock from '@/components/icons/clock';
import Gold from '@/components/icons/gold';
import Hand from '@/components/icons/hand';
import Ligh from '@/components/icons/ligh';
import Send from '@/components/icons/send';
import TableClans from '@/components/TableClans';
import TableResult from '@/components/TableResult';
import TableUser from '@/components/TableUser';
import { useState } from 'react';

// import socket from '@/lib/socket';
// import { useEffect } from 'react';
export default function Home() {
	const [type, setType] = useState('CL');

	const handleTypeMiniGame = (value: string) => {
		setType(value);
	};
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
		<div className="min-w-[300px] flex flex-col gap-5 py-5 transition-all">
			<div className="flex justify-center">
				<div className="max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center">
						<h1 className="text-4xl font-bold">HỆ THỐNG MINI GAME</h1>
						<p className="py-6">
							Kiếm Vàng <br /> Hồi Sinh Ngọc Rồng Giao Dịch Tự Động Uy Tín
						</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<div className="dropdown dropdown-end">
									<div
										tabIndex={0}
										role="button"
										className="btn btn-warning btn-outline rounded-btn">
										Chức Năng
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
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<button className="btn btn-secondary btn-outline rounded-btn">
									Server 1
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Server 2
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Server 3
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Map Boss Sv1
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Map Boss Sv2
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Map Boss Sv3
								</button>
								<button className="btn btn-secondary btn-outline rounded-btn">
									Server 24/24
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-6xl grid grid-cols-2 grid-rows-2 gap-4">
					<div className="col-start-1 row-start-1 card card-side bg-base-100 shadow-xl">
						<div className="card-body items-start">
							<div className="flex flex-col gap-2 w-full">
								<div className="flex flex-row items-center justify-center gap-2">
									<Clock />
									<h2 className="text-center font-semibold text-2xl">
										Kết Quả
									</h2>
								</div>
								<hr className="w-full bg-black" />
							</div>
							<p>
								Mã Phiên:{' '}
								<span className="text-red-500 font-medium">idasm</span>
							</p>
							<p>
								Máy Chủ: <span className="text-red-500 font-medium">1 Sao</span>
							</p>
							<p>
								Kết quả giải trước:{' '}
								<span className="text-red-500 font-medium">0</span>
							</p>
							<p>
								Thời gian còn lại:{' '}
								<span className="text-red-500 font-medium">0</span>
							</p>
							<p>
								Chẳn: <span className="text-red-500 font-medium">0</span> - Lẻ:{' '}
								<span className="text-red-500 font-medium">0</span>
							</p>
							<p>
								Tài: <span className="text-red-500 font-medium">0</span> - Xỉu:{' '}
								<span className="text-red-500 font-medium">0</span>
							</p>
							<p>
								CL: <span>0</span>
							</p>
							<p>
								TX: <span>0</span>
							</p>
						</div>
					</div>
					<div className="col-start-1 row-start-2 card card-side bg-base-100 shadow-xl">
						<div className="card-body">
							<div className="flex flex-col gap-2 w-full">
								<div className="flex flex-row items-center justify-center gap-2">
									<Ligh />
									<h2 className="text-center font-semibold text-2xl">
										Dự Đoán
									</h2>
								</div>
								<hr className="w-full bg-black" />
							</div>
							<div className="btn btn-secondary btn-outline flex items-center gap-2">
								<Gold className="" />
								<p className="font-medium border-l-2">0 Gold</p>
							</div>
							<select
								className="select select-secondary w-full text-red-500 font-medium text-md"
								onChange={(e) => handleTypeMiniGame(e.target.value)}>
								<option
									selected
									value={'CL'}>
									Chẳn lẻ - Tài xỉu (10tr được 19tr)
								</option>
								<option value={'XIEN'}>Xiên (10tr được 30tr)</option>
								<option value={'GUEST'}>Dự đoán kết quả (10tr ăn 700tr)</option>
							</select>
							<div className="flex flex-col gap-2 w-full py-4">
								<div className="flex flex-row items-center justify-center gap-2">
									<Hand />
									<h5 className="text-center font-semibold text-1xl">
										Dự Đoán
									</h5>
								</div>
							</div>
							<div
								className={`grid grid-cols-2 gap-4 ${
									type === 'GUEST' ? 'hidden' : ''
								}`}>
								<button className="btn btn-info btn-outline uppercase">
									{`${type === 'CL' ? 'Chẵn' : 'Chẵn Tài'}`}
								</button>
								<button className="btn btn-success btn-outline uppercase">
									{`${type === 'CL' ? 'Lẻ' : 'Chẵn Xĩu'}`}
								</button>
								<button className="btn btn-warning btn-outline uppercase">
									{`${type === 'CL' ? 'Tài' : 'Lẻ Tài'}`}
								</button>
								<button className="btn btn-error btn-outline uppercase">
									{`${type === 'CL' ? 'Xỉu' : 'Lẻ Xỉu'}`}
								</button>
							</div>

							<div className="input input-bordered input-secondary flex items-center gap-2">
								<Gold className="stroke-secondary" />
								<input
									type="number"
									className="px-4 font-medium border-l-2"
									placeholder="Nhập số vàng chơi"
								/>
							</div>

							<button className="btn btn-outline btn-primary">Chơi Ngay</button>
						</div>
					</div>
					<div className="col-start-2 row-start-1 row-span-2 bg-base-100 shadow-xl p-4 rounded-2xl">
						<div className="flex flex-col gap-2 w-full">
							<div className="flex flex-row items-center justify-center gap-2">
								<Chat />
								<h2 className="text-center font-semibold text-2xl">
									Trò Chuyện
								</h2>
							</div>
							{/* <hr className="w-full bg-black" /> */}
						</div>
						<div className="overflow-auto max-h-[900px] bg-base-200 h-full rounded-lg p-4">
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Hệ thống</div>
								<div className="chat-bubble chat-bubble-primary">
									BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
								</div>
							</div>
							<div className="chat chat-start">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-primary">
									I loved you.
								</div>
							</div>
							<div className="chat chat-end">
								<div className="chat-header">Obi-Wan Kenobi</div>
								<div className="chat-bubble chat-bubble-info">I loved you.</div>
							</div>
						</div>
						<div className="flex flex-row w-full py-2 gap-2">
							<input
								type="text"
								className="grow w-full input input-bordered input-info"
								placeholder="Nhập nội dung trò chuyện"
							/>
							<button className="btn btn-info btn-outline">
								<Send />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-6xl flex flex-row gap-4">
					<button className="btn btn-info btn-outline">Nhận Vàng VIP</button>
					<button className="btn btn-info btn-outline">Ẩn CHAT</button>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-6xl grid grid-rows-3 gap-40">
					<div className="flex flex-col gap-1">
						<div className="w-full p-4 flex justify-center bg-info items-center text-white text-md font-semibold uppercase">
							Lịch Sử Kết Quả
						</div>
						<TableResult />
						<div className="flex flex-row justify-between w-full">
							<div className="flex flex-row items-center gap-2">
								<p className="text-nowrap">Hiển Thị:</p>
								<select className="select select-bordered w-full">
									<option selected>Tất cả</option>
									<option>Chỉ mình tôi</option>
								</select>
							</div>
							<div className="flex flex-row items-center gap-2">
								<p className="text-nowrap">Dòng:</p>
								<select className="select select-bordered w-full">
									<option selected>10</option>
									<option>25</option>
									<option>50</option>
								</select>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="w-full p-4 flex justify-center bg-accent items-center text-white text-md font-semibold uppercase">
							Bang Hội Cái Bang
						</div>
						<TableClans />
					</div>
					<div className="flex flex-col gap-1">
						<div className="w-full p-4 flex justify-center bg-error items-center text-white text-md font-semibold uppercase">
							Bảng Xếp Hạng Ngày
						</div>
						<TableUser />
					</div>
				</div>
			</div>
		</div>
	);
}
