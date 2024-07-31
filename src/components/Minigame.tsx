'use client';
import React, { useState } from 'react';
import Clock from './icons/clock';
import Gold from './icons/gold';
import Ligh from './icons/ligh';
import Hand from './icons/hand';
import { useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import moment from 'moment';
import {
	BetLog,
	CreateUserBet,
	Status24,
	StatusBoss,
	StatusSv,
	userBet,
} from './dto/dto';
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
	const socket = useSocket();
	const dispatch = useAppDispatch();
	const userGame = useAppSelector((state) => state.userGame);
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
				let data_mainBet = data.find((item) => !item.isEnd);
				let data_logBet = data_isEnd;
				dispatch(updateLogBet(data_logBet));
				dispatch(updateMainBet(data_mainBet ?? null));
				dispatch(count(0));
				if (data_mainBet) {
					socket.emit('value-bet-users', {
						betId: data_mainBet._id,
						server: userGame,
					});
				}
			} catch (error) {
				console.error('Error fetching bet logs:', error);
			}
		};

		if (userGame) {
			getDataMiniserver(userGame);
		}
		return () => {};
	}, [userGame, dispatch, socket]);

	useEffect(() => {
		//TODO ———————————————[Handle mini game event]———————————————

		const handleStatusBoss = (data: StatusBoss) => {
			if (data?.type === 'old' && data?.server === userGame) {
				const new_mainBet = data?.boss;
				const old_bet = [
					...(logBet.length > 9 ? logBet.slice(0, -1) : logBet),
					new_mainBet,
				];
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
				const old_bet = [
					...(logBet.length > 9 ? logBet.slice(0, -1) : logBet),
					new_mainBet,
				];
				const sort_bet = old_bet.sort(
					(a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix(),
				);
				dispatch(updateMainBet(null));
				dispatch(updateLogBet(sort_bet));
			}
			if (data?.type === 'new' && data?.server === userGame) {
				dispatch(updateMainBet({ ...data?.sv, timeBoss: data?.timeBoss }));
			}
		};

		const handleStatus24 = (data: Status24) => {
			if (data?.server === userGame) {
				const old_bet = [
					...(logBet.length > 9 ? logBet.slice(0, -1) : logBet),
					data?.old_bet,
				];
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

		socket.on('value-bet-users-re', (data) => {
			if (data?.status) {
				if (data?.data?.data === userGame) {
					dispatch(updateMainBet({ ...mainBet, ...data?.data?.result }));
				}
			}
		});
		socket.on('value-bet-user-re', (data) => {
			if (data?.status) {
				let result = data?.data?.result;
				if (userGame === data?.data?.server && mainBet) {
					let result_bet: BetLog = {
						t: 0,
						x: 0,
						c: 0,
						l: 0,
						0: 0,
						1: 0,
					};
					if ('CXCTLXLT'.indexOf(result) > -1) {
						let split_res: any = result.toLowerCase().split('');
						if (split_res.length > 1) {
							result_bet[split_res[0]] = data?.data?.amount / 2;
							result_bet[split_res[1]] = data?.data?.amount / 2;
						} else {
							result_bet[split_res[0]] = data?.data?.amount;
						}
					}
					if (
						['1', '2', '3'].includes(data?.server) &&
						'01'.indexOf(result) > -1
					) {
						result_bet[result] = data?.data?.amount;
					}
					const newMainBet = { ...mainBet };
					for (const [key, value] of Object.entries(result_bet)) {
						if (
							key in newMainBet &&
							typeof newMainBet[key as keyof BetLog] === 'number' &&
							typeof value === 'number'
						) {
							newMainBet[key as keyof BetLog] += value;
						}
					}
					dispatch(updateMainBet({ ...mainBet, ...newMainBet }));
				}
			}
		});

		// socket.on('result-data-bet-re', (data) => {
		// 	console.log(data);
		// });

		return () => {
			socket.off('status-boss');
			socket.off('status-sv');
			socket.off('status-24/24');
			socket.off('value-bet-users-re');
			socket.off('value-bet-user-re');
			// socket.off('result-data-bet-re');
		};
	}, [socket, dispatch, logBet, userGame, mainBet]);

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

	// useEffect(() => {
	// 	if (counter === 7) {
	// 		socket.emit('result-data-bet', {
	// 			betId: mainBet?._id,
	// 			counter: counter,
	// 		});
	// 	}
	// }, [socket, counter, mainBet]);

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
					{['1', '2', '3'].includes(userGame) ? (
						<>
							<p>
								Đen:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.[1] ?? 0}
								</span>{' '}
								- Đỏ:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.[0] ?? 0}
								</span>
							</p>
						</>
					) : (
						<>
							<p>
								Chẳn:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.c ?? 0}
								</span>{' '}
								- Lẻ:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.l ?? 0}
								</span>
							</p>
							<p>
								Tài:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.t ?? 0}
								</span>{' '}
								- Xỉu:{' '}
								<span className="text-red-500 font-medium">
									{mainBet?.x ?? 0}
								</span>
							</p>
						</>
					)}
					<p>Thời gian hoạt động: {userGame !== '24' ? '8h - 24h' : '24/24'}</p>
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
													className={`btn btn-xs btn-circle btn-outline ${
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
									let totalResult = item?.result?.split('-');
									let result = totalResult && totalResult[0]?.split('')[1];
									return (
										<li key={item._id}>
											<div
												className="tooltip"
												data-tip={`${totalResult && totalResult[1]}`}>
												<div
													className={`btn btn-xs btn-circle btn-outline ${
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
											className={`btn btn-xs btn-outline ${
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
	const socket = useSocket();
	const type = useAppSelector((state) => state.typeGame);
	const userGame = useAppSelector((state) => state.userGame);
	const betInfo = useAppSelector((state) => state.betInfo);
	const user = useAppSelector((state) => state.user);
	const mainBet = useAppSelector((state) => state.mainBetGame) as BetLog | null;
	const userBetLog = useAppSelector((state) => state.userBetLog);
	const [msg, setMsg] = useState({ isShow: false, msg: '' });
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
		if (!user.isLogin) {
			showModelLogin();
			return;
		}
		if (user)
			if (betInfo.amount < 1 && betInfo.type.length < 1) {
				showModelBet('Xin vui lòng kiểm tra dự đoán và đặt tiền cược!');
				return;
			}

		if (betInfo.amount < 3) {
			showModelBet('Tiền cược tối thiểu là 3 thỏi vàng');
			return;
		}
		isDisableBtn(true);

		if (type === 'BOSS') {
			const data: CreateUserBet = {
				amount: betInfo.amount,
				betId: mainBet?._id,
				result: betInfo.type,
				server: userGame,
				uid: user._id,
			};
			socket.emit('bet-user-ce-boss', data);
		} else {
			const data: CreateUserBet = {
				amount: betInfo.amount,
				betId: mainBet?._id,
				result: betInfo.type,
				server: userGame,
				uid: user._id,
			};
			socket.emit('bet-user-ce-sv', data);
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

	const isDisableBtn = (isDisable: boolean) => {
		const modal = document.getElementById(
			'btn_bet',
		) as HTMLButtonElement | null;
		if (modal) {
			modal.disabled = isDisable;
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
		//TODO ———————————————[Event Bet Res Reuslt]———————————————
		socket.on('re-bet-user-res-sv', (data) => {
			const userBets: userBet[] = data?.data;
			if (user?.isLogin) {
				const target = userBets.filter((bet) => bet.uid === user?._id);
				let amount = 0;
				for (const bet of target) {
					amount += bet.receive;
				}
				const { gold = 0, totalBet = 0, ...rs } = user;
				dispatch(
					updateUser({
						...rs,
						gold: gold + amount,
						totalBet: totalBet + amount,
					}),
				);
			}
			if (data?.server === userGame) {
				// Update Table UserBetLog
				const new_userBetLog = userBetLog.map((bet) => {
					let target = userBets.find((b) => b._id === bet._id);
					if (target) {
						target.isEnd = true;
						return target;
					}
					return bet;
				});
				dispatch(updateAll(new_userBetLog));
			}
		});

		socket.on('re-bet-user-res-boss', (data) => {
			const userBets: userBet[] = data?.data;
			if (user?.isLogin) {
				const target = userBets.filter((bet) => bet.uid === user?._id);
				let amount = 0;
				for (const bet of target) {
					amount += bet.receive;
				}
				const { gold = 0, totalBet = 0, ...rs } = user;
				dispatch(
					updateUser({
						...rs,
						gold: gold + amount,
						totalBet: totalBet + amount,
					}),
				);
			}
			if (data?.server === userGame) {
				// Update Table UserBetLog
				const new_userBetLog = userBetLog.map((bet) => {
					let target = userBets.find((b) => b._id === bet._id);
					if (target) {
						target.isEnd = true;
						return target;
					}

					return bet;
				});
				dispatch(updateAll(new_userBetLog));
			}
		});

		//TODO ———————————————[Handle Event Bet create]———————————————

		socket.on('re-bet-user-ce-sv', (data) => {
			if (user?.isLogin && user?._id === data?.data[0]?.uid) {
				showModelBet(data?.message);
			}
			if (data?.status) {
				if (data?.data[0]?.uid === user._id) {
					const { gold = 0, ...rs } = user;
					dispatch(updateUser({ ...rs, gold: gold - betInfo.amount }));
					dispatch(resetBet());
				}
				// Update Table User BetLog
				// const list_notEnd = userBetLog.filter((b) => !b.isEnd);
				// const list_isEnd = userBetLog.filter((b) => b.isEnd);
				// dispatch(
				// 	updateAll([data?.data[0], ...list_notEnd, ...list_isEnd.slice(1)]),
				// );
				if (data?.server === userGame) {
					// Update Table User BetLog
					const updatedUserBetLog = [data?.data[0], ...userBetLog].slice(
						0,
						userBetLog.length,
					);
					dispatch(updateAll(updatedUserBetLog));
				}
			} else {
				if (data?.data[0]?.uid === user._id) {
					showModelBet(data?.message);
					dispatch(resetBet());
				}
			}
		});

		socket.on('re-bet-user-ce-boss', (data) => {
			if (user?.isLogin && user?._id === data?.data[0]?.uid) {
				showModelBet(data?.message);
			}
			if (data?.status) {
				if (data?.data[0]?.uid === user._id) {
					const { gold = 0, ...rs } = user;
					dispatch(updateUser({ ...rs, gold: gold - betInfo.amount }));
					dispatch(resetBet());
				}
				if (data?.server === userGame) {
					// Update Table User BetLog
					const updatedUserBetLog = [data?.data[0], ...userBetLog].slice(
						0,
						userBetLog.length,
					);
					dispatch(updateAll(updatedUserBetLog));
				}
			} else {
				if (data?.data[0]?.uid === user._id) {
					showModelBet(data?.message);
					dispatch(resetBet());
				}
			}
		});

		return () => {
			socket.off('re-bet-user-ce-sv');
			socket.off('re-bet-user-ce-boss');
			socket.off('re-bet-user-res-sv');
			socket.off('re-bet-user-res-boss');
		};
	}, [socket, dispatch, user, betInfo, userBetLog, userGame]);

	useEffect(() => {
		let input_amount = document.getElementById(
			'amount-bet',
		) as HTMLInputElement;
		if (input_amount) {
			input_amount.value = `${betInfo.amount}`;
		}
	}, [betInfo]);

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
						disabled={['1', '2', '3'].includes(userGame)}>
						Chẳn lẻ - Tài xỉu (10tv được 19tv)
					</option>
					<option
						value={'XIEN'}
						disabled={['1', '2', '3'].includes(userGame)}>
						Xiên (10tv được 32tv)
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
						stroke-width="1.5"
						stroke="currentColor"
						className="size-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
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
							betInfo.type === '1' ? '' : 'btn-outline'
						}`}
						onClick={() => handlerBetType('1')}>
						Núi Khỉ Đen
					</button>
					<button
						className={`btn btn-error uppercase ${
							betInfo.type === '0' ? '' : 'btn-outline'
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
						defaultValue={betInfo.amount ?? 0}
						onChange={(e) => {
							dispatch(changeAmountInput(Number(e.target.value)));
							console.log(Number(e.target.value), betInfo.amount);
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
					onClick={handlerBetUser}>
					Chơi Ngay
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

				{/* <dialog
					id="error_bet"
					className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
						<p className="py-4"></p>
						<div className="modal-action">
							<form method="dialog">
								<button className="btn">Đóng</button>
							</form>
						</div>
					</div>
				</dialog> */}
			</div>
		</div>
	);
};
