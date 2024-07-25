'use client';

import ChatBox from '@/components/Chat';
import { BetMinigame, Minigame } from '@/components/Minigame';
import TableClans from '@/components/TableClans';
import TableResult from '@/components/TableResult';
import TableUser from '@/components/TableUser';
import { useState } from 'react';
export default function Home() {
	const [server, setServer] = useState('24');
	return (
		<div className="min-w-[300px] flex flex-col gap-5 py-5 transition-all">
			<div className="flex justify-center">
				<div className="max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center">
						<h1 className="text-4xl font-bold">HỆ THỐNG MINI GAME</h1>
						<p className="py-6 mb-4 border-b border-current">
							Kiếm Vàng <br /> Hồi Sinh Ngọc Rồng Giao Dịch Tự Động Uy Tín
						</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<div className="dropdown ">
									<div
										tabIndex={0}
										role="button"
										className="btn  btn-neutral">
										Chức Năng
									</div>
									<ul
										tabIndex={0}
										className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
										<li>
											<p>Mua Vàng</p>
										</li>
										<li>
											<p>Nạp Vàng</p>
										</li>
										<li>
											<p>Nhiệm Vụ Hàng Ngày</p>
										</li>
										<li>
											<p>Nhập Giftcode</p>
										</li>
										<li>
											<p>Thông Tin Cá Nhân</p>
										</li>
										<li>
											<p>Chuyển Vàng</p>
										</li>
										<li>
											<p>Rút Về Bank</p>
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
								<button
									onClick={() => setServer('1-mini')}
									className={`${
										server === '1-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 1
								</button>
								<button
									onClick={() => setServer('2-mini')}
									className={`${
										server === '2-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 2
								</button>
								<button
									onClick={() => setServer('3-mini')}
									className={`${
										server === '3-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 3
								</button>
								<button
									onClick={() => setServer('1')}
									className={`${
										server === '1' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv1
								</button>
								<button
									onClick={() => setServer('2')}
									className={`${
										server === '2' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv2
								</button>
								<button
									onClick={() => setServer('3')}
									className={`${
										server === '3' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv3
								</button>
								<button
									onClick={() => setServer('24')}
									className={`${
										server === '24' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 24/24
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl grid lg:grid-cols-2 lg:grid-rows-5 grid-flow-row gap-4">
					<Minigame server={server} />
					<BetMinigame server={server} />
					<ChatBox />
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl grid grid-rows-3 gap-40">
					<TableResult />
					<TableClans />
					<TableUser />
				</div>
			</div>
		</div>
	);
}
