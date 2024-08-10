import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

export interface HistoryServer {
	sendIn?: number;
	sendOut?: number;
	jackpot?: number;
	server?: string;
	createdAt?: Date;
	updatedAt?: Date;
	_id?: string;
	__v?: number;
}

const initialState: HistoryServer = {};

export const historyServer = createSlice({
	name: 'historyServer',
	initialState,
	reducers: {
		updateHistoryServer: (state, action: PayloadAction<HistoryServer>) => {
			return action.payload;
		},
	},
});

export const { updateHistoryServer } = historyServer.actions;

export default historyServer.reducer;
