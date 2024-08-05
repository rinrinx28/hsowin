import { BetLog } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: BetLog | null = null;

interface SumMainBet {
	t?: number;
	x?: number;
	c?: number;
	l?: number;
	0?: number;
	1?: number;
}

export const MainBetGame = createSlice({
	name: 'MainBetGame',
	initialState: initialState as BetLog | null,
	reducers: {
		updateMainBet: (state, action: PayloadAction<BetLog | null>) => {
			return action.payload;
		},
		updateSumMainBet: (state, action: PayloadAction<SumMainBet>) => {
			return { ...state, ...action.payload };
		},
	},
});

export const { updateMainBet, updateSumMainBet } = MainBetGame.actions;

export default MainBetGame.reducer;
