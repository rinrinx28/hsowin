import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface missionState {
	_id?: string;

	uid?: string;

	data?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

// Define the initial state using that type
const initialState: missionState = {};

export const mission = createSlice({
	name: 'mission',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		updateMission: (state, actions: PayloadAction<missionState>) => {
			return actions.payload;
		},
	},
});

export const { updateMission } = mission.actions;

export default mission.reducer;
