import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

export interface Message {
	uid: string;
	content: string;
	username?: string;
	server?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const initialState: Message[] = [];

export const messageLog = createSlice({
	name: 'messageLog',
	initialState,
	reducers: {
		updateMsgOne: (state, action: PayloadAction<Message>) => {
			state.push(action.payload);
		},
		updateMsgAll: (state, action: PayloadAction<Message[]>) => {
			return action.payload;
		},
	},
});

export const { updateMsgOne, updateMsgAll } = messageLog.actions;

export default messageLog.reducer;
