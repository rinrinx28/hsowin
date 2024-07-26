import { userBet } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: userBet[] = [];

export const userBetLog = createSlice({
	name: 'userBetLog',
	initialState,
	reducers: {
		updateOne: (state, action: PayloadAction<userBet>) => {
			state.push(action.payload);
		},
		updateAll: (state, action: PayloadAction<userBet[]>) => {
			return action.payload;
		},
	},
});

export const { updateOne, updateAll } = userBetLog.actions;

export default userBetLog.reducer;
