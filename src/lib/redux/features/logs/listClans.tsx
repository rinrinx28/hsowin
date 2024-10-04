import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clanState } from '../rank/clanRanks';

const initialState: clanState[] = [];

export const listClans = createSlice({
	name: 'listClans',
	initialState,
	reducers: {
		updatelistClans: (state, action: PayloadAction<clanState[]>) => {
			return action.payload;
		},
	},
});

export const { updatelistClans } = listClans.actions;

export default listClans.reducer;
