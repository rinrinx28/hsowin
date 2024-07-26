import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userClan {
	clanId: string;
	timejoin: Date;
}

interface userState {
	_id?: string;

	username?: string;

	email?: string;

	name?: string;

	gold?: number;

	diamon?: number;

	clan?: userClan;

	totalBet?: number;

	limitedTrade?: number;

	server?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

const initialState: userState[] = [];

export const userRank = createSlice({
	name: 'userRank',
	initialState,
	reducers: {
		updateUserRanks: (state, action: PayloadAction<userState[]>) => {
			return action.payload;
		},
	},
});

export const { updateUserRanks } = userRank.actions;

export default userRank.reducer;
