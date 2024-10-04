import { configureStore } from '@reduxjs/toolkit';
import LogBetGameSlice from './features/Minigame/LogBetGameSlice';
import userGameSlice from './features/Minigame/userGameSlice';
import MainBetGameSlice from './features/Minigame/MainBetGameSlice';
import countDownTimeSlice from './features/Minigame/countDownTimeSlice';
import users from './features/auth/user';
import typeGame from './features/Minigame/typeGame';
import betInfo from './features/Minigame/betInfo';
import userBetLog from './features/logs/userBetLog';
import userRanks from './features/rank/userRanks';
import messageLog from './features/logs/messageLog';
import eventConfig from './features/logs/eventConfig';
import userVip from './features/auth/userVip';
import historyServer from './features/logs/historyServer';
import missionDaily from './features/auth/missionDaily';
import diemDanhStore from './features/logs/diemdanh';
import clanRanks from './features/rank/clanRanks';
import messageClan from './features/logs/messageClan';
import listClans from './features/logs/listClans';

export const makeStore = () => {
	return configureStore({
		reducer: {
			userGame: userGameSlice,
			logBetGame: LogBetGameSlice,
			mainBetGame: MainBetGameSlice,
			countDownTime: countDownTimeSlice,
			user: users,
			typeGame: typeGame,
			betInfo: betInfo,
			userBetLog: userBetLog,
			userRanks: userRanks,
			clanRanks: clanRanks,
			messageLog: messageLog,
			eventConfig: eventConfig,
			userVip: userVip,
			historyServer: historyServer,
			missionDaily: missionDaily,
			diemDanhStore: diemDanhStore,
			messageClan: messageClan,
			listClans: listClans,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
