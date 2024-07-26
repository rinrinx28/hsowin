'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { update } from '@/lib/redux/features/Minigame/userGameSlice';
import { updateLogBet } from './features/Minigame/LogBetGameSlice';
import { updateMainBet } from './features/Minigame/MainBetGameSlice';
import { count } from './features/Minigame/countDownTimeSlice';

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
		storeRef.current.dispatch(update('24'));
		storeRef.current.dispatch(updateLogBet([]));
		storeRef.current.dispatch(updateMainBet(null));
		storeRef.current.dispatch(count(0));
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
