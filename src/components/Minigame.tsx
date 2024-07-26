'use client';
import React from 'react';
import Clock from './icons/clock';
import Gold from './icons/gold';
import Ligh from './icons/ligh';
import Hand from './icons/hand';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import moment from 'moment';
import { BetLog, Status24, StatusBoss, StatusSv } from './dto/dto';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useSocket } from '@/lib/socket';
import { count } from '@/lib/redux/features/Minigame/countDownTimeSlice';
import { updateMainBet } from '@/lib/redux/features/Minigame/MainBetGameSlice';
import { updateLogBet } from '@/lib/redux/features/Minigame/LogBetGameSlice';
moment().format();

export const Minigame = () => {
	const socket = useSocket();
	const dispatch = useAppDispatch();
	const userGame = useAppSelector((state) => state.userGame.value);
	const mainBet = useAppSelector((state) => state.mainBetGame) as BetLog | null;
	const logBet = useAppSelector((state) => state.logBetGame);
	const counter = useAppSelector((state) => state.countDownTime.value);

	useEffect(() => {
		const getDataMiniserver = async (server: string) => {
			try {
				const response = await apiClient.post<BetLog[]>(
					'/bet-log/topBet/server',
					{
						server,
						limited: 10,
					},
				);
				const data = response.data;
				// Let check show 10 log has isEnd
				let data_isEnd = data.filter((item) => item.isEnd);
				let data_mainBet = data_isEnd.length === 10 ? data[0] : null;
				let data_logBet =
					data_isEnd.length === 10 ? data.slice(1) : data.slice(0, -1);
				// console.log(data_mainBet, data_logBet);
				dispatch(updateLogBet(data_logBet));
				dispatch(updateMainBet(data_mainBet));
				dispatch(count(0));
			} catch (error) {
				console.error('Error fetching bet logs:', error);
			}
		};

		if (userGame) {
			getDataMiniserver(userGame);
		}
		return () => {};
	}, [userGame, dispatch]);

	useEffect(() => {
		const loop = setInterval(() => {
			let now = moment().unix();
			let timeEnd = moment(mainBet?.timeEnd).unix();
			let time = Math.floor(timeEnd - now);
			dispatch(count(time));
		}, 1e3);

		return () => {
			clearInterval(loop);
		};
	}, [mainBet, dispatch]);

	useEffect(() => {
		const handleStatusBoss = (data: StatusBoss) => {
			if (data?.type === 'old' && data?.server === userGame) {
				const new_mainBet = data?.boss;
				const old_bet = [...logBet.slice(0, -1), new_mainBet];
				const sort_bet = old_bet.sort(
					(a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix(),
				);
				dispatch(updateMainBet(null));
				dispatch(updateLogBet(sort_bet));
			}
			if (data?.type === 'new' && data?.server === userGame) {
				dispatch(updateMainBet(data?.boss));
			}
		};

		const handleStatusSv = (data: StatusSv) => {
			if (data?.type === 'old' && data?.server === userGame) {
				const new_mainBet = data?.sv;
				const old_bet = [...logBet.slice(0, -1), new_mainBet];
				const sort_bet = old_bet.sort(
					(a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix(),
				);
				dispatch(updateMainBet(null));
				dispatch(updateLogBet(sort_bet));
			}
			if (data?.type === 'new' && data?.server === userGame) {
				dispatch(updateMainBet(data?.sv));
			}
		};

		const handleStatus24 = (data: Status24) => {
			if (data?.server === userGame) {
				const old_bet = [...logBet.slice(0, -1), data?.old_bet];
				const sort_bet = old_bet.sort(
					(a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix(),
				);
				dispatch(updateLogBet(sort_bet));
				dispatch(updateMainBet(data?.new_bet));
			}
		};

		socket.on('status-boss', handleStatusBoss);
		socket.on('status-sv', handleStatusSv);
		socket.on('status-24/24', handleStatus24);

		return () => {
			socket.off('status-boss', handleStatusBoss);
			socket.off('status-sv', handleStatusSv);
			socket.off('status-24/24', handleStatus24);
		};
	}, [socket, userGame, logBet, dispatch]);

	return (
		<div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 card card-side bg-base-100 shadow-xl border border-current">
			<div className="card-body items-start">
				<div className="flex flex-col gap-2 w-full border-b border-current">
					<div className="flex flex-row items-center justify-center gap-2">
						<Clock />
						<h2 className="text-center font-semibold text-2xl">Kết Quả</h2>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<p>
						Mã Phiên:{' '}
						<span className="text-red-500 font-medium">
							{mainBet?._id ?? 'Đang đợi phiên mới ...'}
						</span>
					</p>
					<p>
						Máy Chủ:{' '}
						<span className="text-red-500 font-medium">
							{userGame.replace('-mini', ' Sao') ?? '1 Sao'}
						</span>
					</p>
					<p>
						Kết quả giải trước:{' '}
						<span className="text-red-500 font-medium">
							{userGame.endsWith('mini') || userGame === '24'
								? logBet[0]?.result.split('-')[1]
								: logBet[0]?.result === '0'
								? 'Đỏ'
								: 'Đen'}
						</span>
					</p>
					<p>
						Thời gian còn lại:{' '}
						<span className="countdown">
							{counter > 0 ? (
								`${counter}`
							) : (
								<span className="loading loading-spinner"></span>
							)}
						</span>
					</p>
					<p>
						Chẳn: <span className="text-red-500 font-medium">0</span> - Lẻ:{' '}
						<span className="text-red-500 font-medium">0</span>
					</p>
					<p>
						Tài: <span className="text-red-500 font-medium">0</span> - Xỉu:{' '}
						<span className="text-red-500 font-medium">0</span>
					</p>
					<p>Thời gian hoạt động: 24/24</p>
				</div>
				{userGame.endsWith('mini') || userGame === '24' ? (
					<>
						<div className="flex flex-row gap-2 items-center">
							<p>CL:</p>
							<ul className="flex flex-row-reverse gap-2">
								{logBet?.map((item) => {
									let totalResult = item.result.split('-');
									let result = totalResult[0].split('')[0];
									return (
										<li key={item._id}>
											<div
												className="tooltip"
												data-tip={`${totalResult[1]}`}>
												<div
													className={`btn btn-sm btn-circle btn-outline ${
														result === 'C' ? '' : 'btn-error'
													}`}>
													{result}
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
						<div className="flex flex-row gap-2 items-center">
							<p>TX:</p>
							<ul className="flex flex-row-reverse gap-2">
								{logBet?.map((item) => {
									let totalResult = item.result.split('-');
									let result = totalResult[0].split('')[1];
									return (
										<li key={item._id}>
											<div
												className="tooltip"
												data-tip={`${totalResult[1]}`}>
												<div
													className={`btn btn-sm btn-circle btn-outline ${
														result === 'T' ? '' : 'btn-error'
													}`}>
													{result}
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</>
				) : (
					<ul className="flex flex-row-reverse gap-2">
						{logBet?.map((item) => {
							let totalResult = item.result;
							return (
								<li key={item._id}>
									<div
										className="tooltip"
										data-tip={`${totalResult === '1' ? 'Đen' : 'Đỏ'}`}>
										<div
											className={`btn btn-sm btn-outline ${
												totalResult === '1' ? '' : 'btn-error'
											}`}>
											{totalResult === '1' ? 'Đen' : 'Đỏ'}
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

export const BetMinigame = () => {
	const [type, setType] = useState('CL');

	const handleTypeMiniserver = (value: string) => {
		setType(value);
	};
	return (
		<div className="lg:col-start-1 lg:row-start-3 row-span-3 card card-side justify-center items-center bg-base-100 shadow-xl border border-current">
			<div className="card-body">
				<div className="flex flex-col gap-2 w-full border-b border-current">
					<div className="flex flex-row items-center justify-center gap-2">
						<Ligh />
						<h2 className="text-center font-semibold text-2xl">Dự Đoán</h2>
					</div>
				</div>
				<div className="btn btn-outline flex items-center gap-2">
					<Gold className="" />
					<p className="font-medium border-l-2">0 Gold</p>
				</div>
				<select
					defaultValue={'CL'}
					className="select select-error w-full text-red-500 font-medium text-md"
					onChange={(e) => handleTypeMiniserver(e.target.value)}>
					<option value={'CL'}>Chẳn lẻ - Tài xỉu (10tr được 19tr)</option>
					<option value={'XIEN'}>Xiên (10tr được 30tr)</option>
					<option value={'GUEST'}>Dự đoán kết quả (10tr ăn 700tr)</option>
				</select>
				<div className="flex flex-col gap-2 w-full py-4">
					<div className="flex flex-row items-center justify-center gap-2">
						<Hand />
						<h5 className="text-center font-semibold text-1xl">Dự Đoán</h5>
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

				<div className="input input-bordered flex items-center gap-2">
					<Gold className="" />
					<input
						type="number"
						className="px-4 font-medium border-l-2"
						placeholder="Nhập số vàng chơi"
						min={3}
					/>
				</div>

				<button className="btn btn-outline ">Chơi Ngay</button>
			</div>
		</div>
	);
};
