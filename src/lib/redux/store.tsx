import { configureStore } from '@reduxjs/toolkit';
import LogBetGameSlice from './features/Minigame/LogBetGameSlice';
import userGameSlice from './features/Minigame/userGameSlice';
import MainBetGameSlice from './features/Minigame/MainBetGameSlice';
import countDownTimeSlice from './features/Minigame/countDownTimeSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			userGame: userGameSlice,
			logBetGame: LogBetGameSlice,
			mainBetGame: MainBetGameSlice,
			countDownTime: countDownTimeSlice,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
