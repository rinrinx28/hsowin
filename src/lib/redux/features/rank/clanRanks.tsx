import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userState } from '../auth/user';

export interface clanState {
	_id?: string;

	ownerId?: string;

	clanName?: string;

	typeClan?: string;

	totalBet?: string;

	member?: string;

	descriptions?: string;

	members?: userState[];

	createdAt?: Date;
	updatedAt?: Date;
}

const initialState: clanState[] = [];

export const clansRanks = createSlice({
	name: 'clansRanks',
	initialState,
	reducers: {
		updateclansRanks: (state, action: PayloadAction<clanState[]>) => {
			return action.payload;
		},
	},
});

export const { updateclansRanks } = clansRanks.actions;

export default clansRanks.reducer;
