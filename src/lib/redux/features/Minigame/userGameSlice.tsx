import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define a type for the slice state
export interface userGameState {
	value: string;
}

// Define the initial state using that type
const initialState: userGameState = {
	value: '24',
};

export const userGame = createSlice({
	name: 'userGame',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		update: (state, actions: PayloadAction<string>) => {
			state.value = actions.payload;
		},
	},
});

export const { update } = userGame.actions;

export default userGame.reducer;
