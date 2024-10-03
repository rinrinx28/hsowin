import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define a type for the slice state

interface userClan {
	clanId: string;
	timejoin: Date;
}

export interface userState {
	_id?: string;

	username?: string;

	email?: string;

	name?: string;

	gold?: number;

	diamon?: number;

	clan?: string;

	totalBet?: number;

	limitedTrade?: number;

	trade?: number;

	server?: string;

	avatar?: string;

	vip?: number;

	totalBank?: number;

	totalClan?: number;

	type?: string;

	createdAt?: Date;
	updatedAt?: Date;
	token?: string;
	isLogin: boolean;
}

// Define the initial state using that type
const initialState: userState = {
	isLogin: false,
};

export const user = createSlice({
	name: 'user',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		login: (state, actions: PayloadAction<userState>) => {
			return actions.payload;
		},
		updateUser: (state, actions: PayloadAction<userState>) => {
			return actions.payload;
		},
	},
});

export const { login, updateUser } = user.actions;

export default user.reducer;
