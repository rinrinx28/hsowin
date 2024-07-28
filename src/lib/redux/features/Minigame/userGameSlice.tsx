import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define a type for the slice state

type userTypeGame = '1' | '2' | '3' | '1-mini' | '2-mini' | '3-mini' | '24';

// Define the initial state using that type
const initialState: userTypeGame = '24';

export const userGame = createSlice({
	name: 'userGame',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState: initialState as userTypeGame,
	reducers: {
		updateUserGame: (state, actions: PayloadAction<userTypeGame>) => {
			return actions.payload;
		},
	},
});

export const { updateUserGame } = userGame.actions;

export default userGame.reducer;
