'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from './redux/hook';
import { updateMsgOne } from './redux/features/logs/messageLog';
import { updateHistoryServer } from './redux/features/logs/historyServer';
import {
	BetLog,
	Status24,
	StatusBoss,
	StatusSv,
	userBet,
} from '@/components/dto/dto';
import { updateMainBet } from './redux/features/Minigame/MainBetGameSlice';
import { updateLogBet } from './redux/features/Minigame/LogBetGameSlice';
import { updateUser } from './redux/features/auth/user';
import { updateAll } from './redux/features/logs/userBetLog';
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
	const user = useAppSelector((state) => state.user);
	const userGame = useAppSelector((state) => state.userGame);
	const mainBet = useAppSelector((state) => state.mainBetGame) as BetLog | null;
	const logBet = useAppSelector((state) => state.logBetGame);
	const userBetLog = useAppSelector((state) => state.userBetLog);

	useEffect(() => {
		socket.connect();
		//TODO ———————————————[Handle event noti]———————————————
		socket.on('noti-bet', (data) => {
			dispatch(updateMsgOne(data));
		});

		socket.on('noti-system', (data) => {
			dispatch(updateMsgOne(data));
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

	useEffect(() => {
		socket.on('message-user-re', (data) => {
			if (data?.status) {
				dispatch(updateMsgOne(data?.msg));
			} else {
				if (data?.token === user?.token) {
					const modal = document.getElementById(
						'error_chat',
					) as HTMLDialogElement | null;
					let msg = document.getElementById('msg') as HTMLElement | null;
					if (modal && msg) {
						msg.innerText = data?.msg ?? '';
						modal.showModal();
					}
				}
			}
		});

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

		socket.on('mainBet-up', (data) => {
			if (data?.server === userGame) {
				dispatch(updateMainBet({ ...mainBet, ...data }));
			}
		});

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

		return () => {
			socket.off('message-system-re');
			//TODO ———————————————[Handle mini game event]———————————————
			socket.off('status-boss');
			socket.off('status-sv');
			socket.off('status-24/24');
			socket.off('mainBet-up');
			//TODO ———————————————[Event Bet Res Reuslt]———————————————
			socket.off('re-bet-user-res-sv');
			socket.off('re-bet-user-res-boss');
		};
	}, [dispatch, user, logBet, userGame, mainBet, userBetLog]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
