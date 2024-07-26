import { BetLog } from '@/components/dto/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type game = 'CL' | 'XIEN' | 'GUEST' | 'BOSS';

interface tpyeGameState {
	type: game;
}

// Define the initial state using that type
const initialState: tpyeGameState = {
	type: 'CL',
};

export const typeGame = createSlice({
	name: 'typeGame',
	initialState,
	reducers: {
		change: (state, action: PayloadAction<tpyeGameState>) => {
			state.type = action.payload.type;
		},
	},
});

export const { change } = typeGame.actions;

export default typeGame.reducer;
