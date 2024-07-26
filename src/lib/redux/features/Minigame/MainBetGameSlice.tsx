import { BetLog } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: BetLog | null = null;

export const MainBetGame = createSlice({
	name: 'MainBetGame',
	initialState: initialState as BetLog | null,
	reducers: {
		updateMainBet: (state, action: PayloadAction<BetLog | null>) => {
			return action.payload;
		},
	},
});

export const { updateMainBet } = MainBetGame.actions;

export default MainBetGame.reducer;
