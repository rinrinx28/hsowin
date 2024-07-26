import { BetLog } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: BetLog[] = [];

export const LogBetGame = createSlice({
	name: 'LogBetGame',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		updateLogBet: (state, actions: PayloadAction<BetLog[]>) => {
			return actions.payload;
		},
	},
});

export const { updateLogBet } = LogBetGame.actions;

export default LogBetGame.reducer;
