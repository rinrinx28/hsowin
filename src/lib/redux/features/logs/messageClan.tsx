import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type

export interface MessageClan {
	uid: string;
	content: string;
	username?: string;
	server?: string;
	meta?: any;
	createdAt?: Date;
	updatedAt?: Date;
}

const initialState: MessageClan[] = [];

export const messageClanLog = createSlice({
	name: 'messageLog',
	initialState,
	reducers: {
		updateMsgOneClan: (state, action: PayloadAction<MessageClan>) => {
			state.push(action.payload);
		},
		updateMsgAllClan: (state, action: PayloadAction<MessageClan[]>) => {
			return action.payload;
		},
	},
});

export const { updateMsgOneClan, updateMsgAllClan } = messageClanLog.actions;

export default messageClanLog.reducer;
