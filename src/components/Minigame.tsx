'use client';
import React, { useState } from 'react';
import Clock from './icons/clock';
import Gold from './icons/gold';
import Ligh from './icons/ligh';
import Hand from './icons/hand';
import { useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import moment from 'moment';
import { BetLog, CreateUserBet } from './dto/dto';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useSocket } from '@/lib/socket';
import { count } from '@/lib/redux/features/Minigame/countDownTimeSlice';
import { updateMainBet } from '@/lib/redux/features/Minigame/MainBetGameSlice';
import { updateLogBet } from '@/lib/redux/features/Minigame/LogBetGameSlice';
import { changeTypeGame } from '@/lib/redux/features/Minigame/typeGame';
moment().format();
import { PiPokerChip } from 'react-icons/pi';
import {
	changeAmount,
	changeAmountInput,
	changeType,
	resetBet,
	typeBet,
} from '@/lib/redux/features/Minigame/betInfo';
import Link from 'next/link';
import { updateUser } from '@/lib/redux/features/auth/user';
import { updateAll } from '@/lib/redux/features/logs/userBetLog';

export const Minigame = () => {
	// const socket = useSocket();
	const dispatch = useAppDispatch();
	const userGame = useAppSelector((state) => state.userGame);
	const mainBet = useAppSelector((state) => state.mainBetGame) as BetLog | null;
	const logBet = useAppSelector((state) => state.logBetGame);
	const counter = useAppSelector((state) => state.countDownTime.value);
	const historyServer = useAppSelector((state) => state.historyServer);

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
				let data_mainBet = data.find((item) => !item.isEnd);
				let data_logBet = data_isEnd;
				dispatch(updateLogBet(data_logBet));
				dispatch(updateMainBet(data_mainBet ?? null));
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

	return (
		<div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 card bg-base-100 shadow-xl border border-current">
			<div className="card-body items-start">
				<div className="flex flex-col gap-2 w-full border-b border-current">
					<div className="flex flex-row items-center justify-center gap-2">
						<Clock />
						<h2 className="text-center font-semibold text-2xl">Kết Quả</h2>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<div className="flex gap-2 items-center">
						Mã Phiên:{' '}
						<div className="text-red-500 font-medium">
							{mainBet?._id ?? (
								<p className="flex flex-row gap-2 items-end">
									Đang đợi phiên mới
									<span className="loading loading-dots loading-sm"></span>
								</p>
							)}
						</div>
					</div>
					<p className="flex gap-2 items-center">
						Máy Chủ:{' '}
						<span className="text-red-500 font-medium">
							{userGame?.replace('-mini', ' Sao') ?? '1 Sao'}
						</span>
					</p>

					<p className="flex gap-2 items-center">
						Kết quả giải trước:{' '}
						<span className="text-red-500 font-medium">
							{userGame?.endsWith('mini') || userGame === '24'
								? logBet[0]?.result?.split('-')[1]
								: logBet[0]?.result === '0'
								? 'Đỏ'
								: 'Đen'}
						</span>
					</p>
					<div className="flex gap-2 items-center">
						Thời gian còn lại:{' '}
						{counter > 0 ? (
							counter
						) : (
							<span className="loading loading-dots loading-sm"></span>
						)}
					</div>
					{mainBet?.timeBoss ? (
						<p>Thời gian Boss Chết: {changeStringToHour(mainBet?.timeBoss)}</p>
					) : (
						['1-mini', '2-mini', '3-mini'].includes(mainBet?.server ?? '') && (
							<p>
								Thời gian Boss Chết:{' '}
								<span className="loading loading-dots loading-sm"></span>
							</p>
						)
					)}
					{['1', '2', '3'].includes(userGame) ? (
						<>
							<p>
								Đen:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['1'] ?? 0}
								</span>{' '}
								- Đỏ:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['0'] ?? 0}
								</span>
							</p>
						</>
					) : (
						<>
							<p>
								Chẳn:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['c'] ?? 0}
								</span>{' '}
								- Lẻ:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['l'] ?? 0}
								</span>
							</p>
							<p>
								Tài:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['t'] ?? 0}
								</span>{' '}
								- Xỉu:{' '}
								<span className="text-red-500 font-medium">
									{JSON.parse(mainBet?.resultUser ?? '{}')['x'] ?? 0}
								</span>
							</p>
						</>
					)}
					<p>Thời gian hoạt động: {userGame !== '24' ? '8h - 24h' : '24/24'}</p>
					{historyServer && historyServer?.server === userGame && (
						<p>
							Jackpot:{' '}
							<span className="text-green-500 font-extrabold">
								{new Intl.NumberFormat('vi').format(
									historyServer?.jackpot ?? 0,
								)}
							</span>
						</p>
					)}
				</div>
				{userGame?.endsWith('mini') || userGame === '24' ? (
					<>
						<div className="flex flex-row gap-2 items-center">
							<p>CL:</p>
							<ul className="flex flex-row-reverse gap-2">
								{logBet?.map((item) => {
									let totalResult = item?.result?.split('-');
									let result = totalResult && totalResult[0]?.split('')[0];
									return (
										<li key={item._id}>
											<div
												className="tooltip"
												data-tip={`${totalResult && totalResult[1]}`}>
												<div
													className={`size-5 text-xs cursor-help text-center border  rounded-full ${
														result === 'C'
															? 'border-current text-current'
															: 'border-error text-error'
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
									let totalResult = item?.result?.split('-');
									let result = totalResult && totalResult[0]?.split('')[1];
									return (
										<li key={item._id}>
											<div
												className="tooltip"
												data-tip={`${totalResult && totalResult[1]}`}>
												<div
													className={`size-5 text-xs cursor-help text-center border  rounded-full ${
														result === 'T'
															? 'border-current text-current'
															: 'border-error text-error'
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
											className={`size-5 cursor-help text-xs flex justify-center items-center p-2 border  rounded-full ${
												totalResult === '1' ? 'bg-black' : 'bg-red-600'
											}`}></div>
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
	const socket = useSocket();
	const type = useAppSelector((state) => state.typeGame);
	const userGame = useAppSelector((state) => state.userGame);
	const betInfo = useAppSelector((state) => state.betInfo);
	const user = useAppSelector((state) => state.user);
	const mainBet = useAppSelector((state) => state.mainBetGame) as BetLog | null;
	const userBetLog = useAppSelector((state) => state.userBetLog);
	const [msg, setMsg] = useState({ isShow: false, msg: '' });
	const [isPause, setPause] = useState(false);
	const dispatch = useAppDispatch();

	const handleTypeMiniserver = (e: any) => {
		dispatch(changeTypeGame(e.target.value));
		dispatch(resetBet());
	};

	//TODO ———————————————[Handler Bet Info]———————————————

	const handlerBetType = (type: typeBet) => {
		dispatch(changeType(type));
	};

	const handlerBetAmount = (amount: number) => {
		dispatch(changeAmount(amount));
	};

	const handlerBetUser = () => {
		if (!user?.isLogin) {
			showModelLogin();
			return;
		}
		if ((betInfo?.amount ?? 0) < 1 || betInfo?.type.length < 1) {
			showModelBet('Xin vui lòng kiểm tra dự đoán và đặt tiền cược!');
			return;
		}
		if (!mainBet) {
			showModelBet('Hiện tại phiên chưa bắt đầu, xin vui lòng chờ phiên mới!');
			dispatch(resetBet());
			return;
		}
		setPause(true);
		if (userGame === mainBet?.server) {
			if (type === 'BOSS') {
				const data: CreateUserBet = {
					amount: betInfo?.amount ?? 0,
					betId: mainBet?._id,
					result: betInfo?.type,
					server: userGame,
					uid: user?._id,
				};
				socket.emit('bet-user-ce-boss', data);
			} else {
				const data: CreateUserBet = {
					amount: betInfo?.amount ?? 0,
					betId: mainBet?._id,
					result: betInfo?.type,
					server: userGame,
					uid: user?._id,
				};
				socket.emit('bet-user-ce-sv', data);
			}
		} else {
			showModelBet('Đã xảy ra lỗi, xin vui lòng tải lại trang!');
			setPause(false);
			return;
		}
	};

	const showModelLogin = () => {
		const modal = document.getElementById(
			'error_login',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const showModelBet = (message: string) => {
		setMsg({ isShow: true, msg: message });
	};

	useEffect(() => {
		if (['1', '2', '3'].includes(userGame)) {
			dispatch(changeTypeGame('BOSS'));
		} else {
			dispatch(changeTypeGame('CL'));
		}
		dispatch(resetBet());
	}, [userGame, dispatch]);

	useEffect(() => {
		//TODO ———————————————[Handle Event Bet create]———————————————

		socket.on('re-bet-user-ce-sv', (data) => {
			if (data?.status) {
				if (data?.data[0]?.uid === user?._id) {
					setPause(false);
					const { gold = 0, ...rs } = user;
					dispatch(
						updateUser({ ...rs, gold: gold - (betInfo?.amount ?? 0 ?? 0) }),
					);
					dispatch(resetBet());
					showModelBet(data?.message);
				}
				// Update Table User BetLog
				if (data?.server === userGame) {
					// Update Table User BetLog
					const updatedUserBetLog = [
						data?.data[0],
						...(userBetLog ?? []),
					].slice(0, userBetLog.length);
					dispatch(updateAll(updatedUserBetLog));
				}
			} else {
				if (data?.data[0]?.uid === user?._id) {
					setPause(false);
					showModelBet(data?.message);
					dispatch(resetBet());
				}
			}
		});

		socket.on('re-bet-user-ce-boss', (data) => {
			if (data?.status) {
				if (data?.data[0]?.uid === user?._id) {
					setPause(false);
					const { gold = 0, ...rs } = user;
					dispatch(updateUser({ ...rs, gold: gold - (betInfo?.amount ?? 0) }));
					dispatch(resetBet());
					showModelBet(data?.message);
				}
				if (data?.server === userGame) {
					// Update Table User BetLog
					const updatedUserBetLog = [
						data?.data[0],
						...(userBetLog ?? []),
					].slice(0, userBetLog.length);
					dispatch(updateAll(updatedUserBetLog));
				}
			} else {
				if (data?.data[0]?.uid === user?._id) {
					setPause(false);
					showModelBet(data?.message);
					dispatch(resetBet());
				}
			}
		});

		return () => {
			socket.off('re-bet-user-ce-sv');
			socket.off('re-bet-user-ce-boss');
			// socket.off('re-bet-user-res-sv');
			// socket.off('re-bet-user-res-boss');
		};
	}, [socket, dispatch, user, betInfo, userBetLog, userGame]);

	useEffect(() => {
		let input_amount = document.getElementById(
			'amount-bet',
		) as HTMLInputElement;
		if (input_amount) {
			input_amount.value = `${betInfo?.amount ?? 0}`;
		}
	}, [betInfo]);

	useEffect(() => {
		let autoDelete = setTimeout(() => {
			if (msg.isShow) {
				setMsg((e) => ({ ...e, isShow: false }));
			}
		}, 1e3 * 3);

		return () => {
			clearTimeout(autoDelete);
		};
	}, [msg]);

	return (
		<div className="lg:col-start-1 lg:row-start-3 row-span-3 card card-side justify-center items-center shadow-xl border border-current">
			<div className="card-body gap-6">
				<div className="flex flex-col gap-2 w-full border-b border-current">
					<div className="flex flex-row items-center justify-center gap-2">
						<Ligh />
						<h2 className="text-center font-semibold text-2xl">Dự Đoán</h2>
					</div>
				</div>
				<div className="btn btn-outline flex items-center gap-2">
					<Gold className="" />
					<p className="font-medium border-l-2">
						{new Intl.NumberFormat('vi').format(user?.gold ?? 0)} Thỏi Vàng
					</p>
				</div>
				<select
					defaultValue={'CL'}
					className={`select select-error w-full text-red-500 font-medium text-md`}
					onChange={handleTypeMiniserver}>
					<option
						value={'CL'}
						selected
						disabled={['1', '2', '3'].includes(userGame)}>
						Chẳn lẻ - Tài xỉu (10tv được 19tv)
					</option>
					<option
						value={'XIEN'}
						disabled={['1', '2', '3'].includes(userGame)}>
						{`Xiên (10tv được 32tv)`}
					</option>
					<option
						value={'GUEST'}
						disabled={['1', '2', '3'].includes(userGame)}>
						Dự đoán kết quả (10tv ăn 700tv)
					</option>
					<option
						value={'BOSS'}
						disabled={!['1', '2', '3'].includes(userGame)}
						selected={['1', '2', '3'].includes(userGame)}>
						Dự Đoán BOSS
					</option>
				</select>
				<div className="flex flex-col gap-2 w-full py-4">
					<div className="flex flex-row items-center justify-center gap-2">
						<Hand />
						<h5 className="text-center font-semibold text-1xl">Dự Đoán</h5>
					</div>
				</div>

				{/* Select with Sv Mini and 24/24 */}
				<div
					className={`grid grid-cols-2 gap-4 ${
						['GUEST', 'BOSS'].includes(type) ? 'hidden' : ''
					}`}>
					<button
						className={`btn btn-info uppercase ${
							['C', 'CT'].includes(betInfo?.type) ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType(type === 'CL' ? 'C' : 'CT')}>
						{`${type === 'CL' ? 'Chẵn' : 'Chẵn Tài'}`}
					</button>
					<button
						className={`btn btn-success uppercase ${
							['L', 'CX'].includes(betInfo?.type) ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType(type === 'CL' ? 'L' : 'CX')}>
						{`${type === 'CL' ? 'Lẻ' : 'Chẵn Xĩu'}`}
					</button>
					<button
						className={`btn btn-warning uppercase ${
							['T', 'LT'].includes(betInfo?.type) ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType(type === 'CL' ? 'T' : 'LT')}>
						{`${type === 'CL' ? 'Tài' : 'Lẻ Tài'}`}
					</button>
					<button
						className={`btn btn-error uppercase ${
							['X', 'LX'].includes(betInfo?.type) ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType(type === 'CL' ? 'X' : 'LX')}>
						{`${type === 'CL' ? 'Xỉu' : 'Lẻ Xỉu'}`}
					</button>
				</div>
				{/* Select with Type bet for guest number */}
				<label
					className={`input input-bordered flex items-center gap-2 ${
						type === 'GUEST' ? '' : 'hidden'
					}`}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
						/>
					</svg>

					<input
						type="text"
						className="grow border-l-2 px-4"
						placeholder="Nhập số dự đoán. Ví dụ: 11"
						onChange={(e) => {
							let value = e.target.value;
							let checkOne = value.split(',');
							let checkTwo = value.split('');
							if (checkTwo.length > 2 || checkOne.length > 1) {
								showModelBet(
									'Xin vui lòng kiểm tra dự đoán, chỉ đươc phép dùng một cặp số. Ví dụ: 28',
								);
								return;
							}
							dispatch(changeType(value));
						}}
					/>
				</label>

				{/* Select with Type bet for boss respawn */}
				<div
					className={`grid grid-cols-2 gap-4 ${
						type === 'BOSS' ? '' : 'hidden'
					}`}>
					<button
						className={`btn btn-primary uppercase ${
							betInfo?.type === '1' ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType('1')}>
						Núi Khỉ Đen
					</button>
					<button
						className={`btn btn-error uppercase ${
							betInfo?.type === '0' ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType('0')}>
						Núi Khỉ Đỏ
					</button>
				</div>
				{/* Select amount */}
				<ul className="flex flex-wrap gap-4 items-center">
					{[50, 100, 200, 500, 1000, 2000].map((value) => {
						return (
							<li key={value}>
								<button
									className="btn btn-outline btn-sm"
									onClick={() => handlerBetAmount(value)}>
									<PiPokerChip />
									{value}
								</button>
							</li>
						);
					})}
				</ul>

				<div className="input input-bordered flex items-center gap-2">
					<button
						className="btn btn-error btn-sm"
						onClick={() => dispatch(resetBet())}>
						<Gold className="" />
					</button>
					<input
						id="amount-bet"
						type="text"
						className="px-4 font-medium border-l-2"
						placeholder="Nhập số vàng chơi"
						defaultValue={betInfo?.amount ?? 0 ?? 0}
						onChange={(e) => {
							dispatch(changeAmountInput(Number(e.target.value)));
						}}
						// disabled
					/>
				</div>

				<div
					role="alert"
					className={`alert shadow-lg ${!msg.isShow && 'hidden'}`}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="stroke-info h-6 w-6 shrink-0">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<div>
						<h3 className="font-bold">Thông báo!</h3>
						<div className="text-xs">{msg.msg}</div>
					</div>
					<button
						onClick={() => setMsg((e) => ({ ...e, isShow: false }))}
						className="btn btn-sm btn-circle btn-ghost">
						✕
					</button>
				</div>

				<button
					id="btn-bet"
					className="btn btn-outline"
					disabled={isPause}
					onClick={handlerBetUser}>
					{isPause ? (
						<span className="loading loading-infinity loading-md"></span>
					) : (
						'Chơi Ngay'
					)}
				</button>

				<dialog
					id="error_login"
					className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
						<p className="py-4">
							Có vẻ bạn chưa đăng nhập, xin vui lòng{' '}
							<Link
								href={'/login'}
								className="link link-hover link-primary">
								đăng nhập
							</Link>{' '}
							để tiếp tục!
						</p>
						<div className="modal-action">
							<form method="dialog">
								{/* if there is a button in form, it will close the modal */}
								<button className="btn">Đóng</button>
							</form>
						</div>
					</div>
				</dialog>
			</div>
		</div>
	);
};

function changeStringToHour(str: string) {
	let new_str = str.split('');
	return new_str[0] + new_str[1] + ':' + new_str[2] + new_str[3];
}
