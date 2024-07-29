'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './redux/hook';
import {
	BetLog,
	Status24,
	StatusBoss,
	StatusSv,
	userBet,
} from '@/components/dto/dto';
import moment from 'moment';
import { updateMainBet } from './redux/features/Minigame/MainBetGameSlice';
import { updateLogBet } from './redux/features/Minigame/LogBetGameSlice';
import { updateMsgOne } from './redux/features/logs/messageLog';
import { updateUser } from './redux/features/auth/user';
import { updateAll } from './redux/features/logs/userBetLog';
moment().format();

const urlConfig = {
	vps: 'http://144.126.145.81:3031',
	https: 'https://api.hsowin.vip',
};

const socket: Socket = io(urlConfig.https);

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
	const userGame = useAppSelector((state) => state.userGame);
	const logBet = useAppSelector((state) => state.logBetGame);
	const user = useAppSelector((state) => state.user);
	const userBetLog = useAppSelector((state) => state.userBetLog);
	useEffect(() => {
		socket.connect();

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
				dispatch(updateMainBet(data?.sv));
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

		//TODO ———————————————[Event Bet Res Reuslt]———————————————
		socket.on('re-bet-user-res-sv', (data) => {
			const userBets: userBet[] = data?.data;
			const target = userBets.filter((bet) => bet.uid === user?._id);
			let amount = 0;
			for (const bet of target) {
				amount += bet.receive;
			}
			const { gold = 0, totalBet = 0, ...rs } = user;
			dispatch(
				updateUser({ ...rs, gold: gold + amount, totalBet: totalBet + amount }),
			);
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
		});

		socket.on('re-bet-user-res-boss', (data) => {
			const userBets: userBet[] = data?.data;
			const target = userBets.filter((bet) => bet.uid === user?._id);
			let amount = 0;
			for (const bet of target) {
				amount += bet.receive;
			}
			const { gold = 0, totalBet = 0, ...rs } = user;
			dispatch(
				updateUser({ ...rs, gold: gold + amount, totalBet: totalBet + amount }),
			);
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
		});

		socket.on('bet-user-del-boss-re', (data) => {
			if (data?.status) {
				if (data?.data?.user?._id === user?._id) {
					dispatch(updateUser({ ...user, ...data?.data?.user }));
				}
				dispatch(
					updateAll([
						...userBetLog.filter((bet) => bet._id !== data?.data?.userBetId),
					]),
				);
			}
		});

		socket.on('bet-user-del-sv-re', (data) => {
			if (data?.status) {
				if (data?.data?.user?._id === user?._id) {
					dispatch(updateUser({ ...user, ...data?.data?.user }));
				}
				dispatch(
					updateAll([
						...userBetLog.filter((bet) => bet._id !== data?.data?.userBetId),
					]),
				);
			}
		});

		//TODO ———————————————[Handle event noti]———————————————

		socket.on('noti-bet', (data) => {
			dispatch(updateMsgOne({ content: data, uid: '' }));
		});

		socket.on('status-boss', handleStatusBoss);
		socket.on('status-sv', handleStatusSv);
		socket.on('status-24/24', handleStatus24);

		return () => {
			socket.disconnect();
			socket.off('status-boss', handleStatusBoss);
			socket.off('status-sv', handleStatusSv);
			socket.off('status-24/24', handleStatus24);
			socket.off('noti-bet');
			socket.off('re-bet-user-res-sv');
			socket.off('re-bet-user-res-boss');
			socket.off('bet-user-del-boss-re');
			socket.off('bet-user-del-sv-re');
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
