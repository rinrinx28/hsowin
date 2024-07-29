import { configureStore } from '@reduxjs/toolkit';
import LogBetGameSlice from './features/Minigame/LogBetGameSlice';
import userGameSlice from './features/Minigame/userGameSlice';
import MainBetGameSlice from './features/Minigame/MainBetGameSlice';
import countDownTimeSlice from './features/Minigame/countDownTimeSlice';
import user from './features/auth/user';
import typeGame from './features/Minigame/typeGame';
import betInfo from './features/Minigame/betInfo';
import userBetLog from './features/logs/userBetLog';
import userRanks from './features/rank/userRanks';
import messageLog from './features/logs/messageLog';

export const makeStore = () => {
	return configureStore({
		reducer: {
			userGame: userGameSlice,
			logBetGame: LogBetGameSlice,
			mainBetGame: MainBetGameSlice,
			countDownTime: countDownTimeSlice,
			user: user,
			typeGame: typeGame,
			betInfo: betInfo,
			userBetLog: userBetLog,
			userRanks: userRanks,
			messageLog: messageLog,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];