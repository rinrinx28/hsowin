import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define a type for the slice state

interface userVipData {
	date?: any;
	isClaim?: boolean;
	isNext?: boolean;
}

export interface userVipState {
	_id?: string;
	uid?: string;
	data?: userVipData[];
	timeEnd?: Date;
	isEnd?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	__v?: number;
}

// Define the initial state using that type
const initialState: userVipState = {};

export const userVip = createSlice({
	name: 'userVip',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		updateUserVip: (state, actions: PayloadAction<userVipState>) => {
			return actions.payload;
		},
	},
});

export const { updateUserVip } = userVip.actions;

export default userVip.reducer;
