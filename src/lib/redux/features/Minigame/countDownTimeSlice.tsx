import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define a type for the slice state
export interface countDownTimeState {
	value: number;
}

// Define the initial state using that type
const initialState: countDownTimeState = {
	value: 0,
};

export const userGame = createSlice({
	name: 'countDownTime',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		count: (state, actions: PayloadAction<number>) => {
			state.value = actions.payload;
		},
	},
});

export const { count } = userGame.actions;

export default userGame.reducer;
