import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type game = 'CL' | 'XIEN' | 'GUEST' | 'BOSS';

// Define the initial state using that type
const initialState: game = 'CL';

export const typeGame = createSlice({
	name: 'typeGame',
	initialState: initialState as game,
	reducers: {
		changeTypeGame: (state, action: PayloadAction<game>) => {
			return action.payload;
		},
	},
});

export const { changeTypeGame } = typeGame.actions;

export default typeGame.reducer;
