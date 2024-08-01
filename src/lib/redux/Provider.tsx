'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { updateUserGame } from '@/lib/redux/features/Minigame/userGameSlice';
import { updateLogBet } from './features/Minigame/LogBetGameSlice';
import { updateMainBet } from './features/Minigame/MainBetGameSlice';
import { count } from './features/Minigame/countDownTimeSlice';
import { login } from './features/auth/user';
import apiClient from '../apiClient';
import { updateAll } from './features/logs/userBetLog';
import { updateUserRanks } from './features/rank/userRanks';
import { changeTypeGame } from './features/Minigame/typeGame';
import { updateMsgAll } from './features/logs/messageLog';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { updateEventConfig } from './features/logs/eventConfig';

export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const storeRef = useRef<AppStore>();
	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore();
		//TODO ———————————————[Current Data Minigame]———————————————
		storeRef.current.dispatch(updateUserGame('24'));
		storeRef.current.dispatch(updateLogBet([]));
		storeRef.current.dispatch(updateMainBet(null));
		storeRef.current.dispatch(count(0));
		storeRef.current.dispatch(login({ isLogin: false }));
		storeRef.current.dispatch(changeTypeGame('CL'));
	}
	const router = useRouter();

	useEffect(() => {
		const relogin = async (token: any) => {
			try {
				const res = await apiClient.get('/auth/relogin', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				const data = res.data;
				if (data.status === 400) throw new Error(data.message);
				storeRef.current?.dispatch(login({ ...data, isLogin: true, token }));
			} catch (err) {
				storeRef.current?.dispatch(login({ isLogin: false }));
				localStorage.removeItem('access_token');
				router.push('/');
			}
		};
		const getUserBetLog = async () => {
			try {
				const res = await apiClient.get('/user/log-bet/all?limit=10&server=24');
				const data = res.data;
				storeRef.current?.dispatch(updateAll(data?.data));
			} catch (err) {}
		};

		const getUserRank = async () => {
			try {
				const res = await apiClient.get('/user/rank');
				const data = res.data;
				storeRef.current?.dispatch(updateUserRanks(data?.data));
			} catch (err) {}
		};

		const getMessageLog = async () => {
			try {
				const res = await apiClient.get('/message/all?page=1&limit=10');
				const data = res.data;
				storeRef.current?.dispatch(
					updateMsgAll(
						data.sort(
							(a: any, b: any) =>
								moment(a.createdAt).unix() - moment(b.createdAt).unix(),
						),
					),
				);
			} catch (err) {}
		};

		const getEventConfig = async () => {
			try {
				const res = await apiClient.get('/user/config');
				const data = res.data;
				storeRef.current?.dispatch(updateEventConfig(data));
			} catch (err) {}
		};
		const isStay = localStorage.getItem('access_token');
		const isTheme =
			typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
		if (isStay) {
			relogin(isStay);
		}
		if (!isTheme) {
			localStorage.setItem('theme', 'false');
		}
		getUserBetLog();
		getUserRank();
		getMessageLog();
		getEventConfig();
		return () => {};
	}, [router]);

	return <Provider store={storeRef.current}>{children}</Provider>;
}
