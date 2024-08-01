import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

export interface EventConfig {
	_id: string;
	__v: number;
	value: number;
	status: boolean;
	description: string;
	name: string;
	option: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const initialState: EventConfig[] = [];

export const eventConfig = createSlice({
	name: 'eventConfig',
	initialState,
	reducers: {
		updateEventConfig: (state, action: PayloadAction<EventConfig[]>) => {
			return action.payload;
		},
	},
});

export const { updateEventConfig } = eventConfig.actions;

export default eventConfig.reducer;
