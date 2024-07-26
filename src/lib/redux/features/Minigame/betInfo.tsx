import { BetLog } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type typeBet =
	| 'C'
	| 'L'
	| 'T'
	| 'X'
	| 'CT'
	| 'CX'
	| 'LT'
	| 'LX'
	| '0'
	| '1'
	| '';

interface tpyeGameState {
	type: typeBet | string;
	amount: number | 0;
}

// Define the initial state using that type
const initialState: tpyeGameState = {
	type: '',
	amount: 0,
};

export const betInfo = createSlice({
	name: 'betInfo',
	initialState,
	reducers: {
		changeType: (state, action: PayloadAction<typeBet | string>) => {
			state.type = action.payload;
		},
		changeAmount: (state, action: PayloadAction<number>) => {
			state.amount += action.payload;
		},
		resetBet: (state) => {
			state.type = '';
			state.amount = 0;
		},
	},
});

export const { changeType, changeAmount, resetBet } = betInfo.actions;

export default betInfo.reducer;
