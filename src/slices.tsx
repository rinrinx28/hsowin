// src/slices.js
import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

const dataSlice = createSlice({
	name: 'data',
	initialState: '',
	reducers: {
		setData: (state, action) => action.payload,
	},
});

export const { setData } = dataSlice.actions;

const rootReducer = combineReducers({
	data: dataSlice.reducer,
});

export default rootReducer;
