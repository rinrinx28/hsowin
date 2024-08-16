import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DiemDanhStore {
	count: number;
	live?: string;
}

const initialState: DiemDanhStore = { count: 0 };

export const diemDanh = createSlice({
	name: 'diemDanh',
	initialState,
	reducers: {
		updateDiemDanh: (state, action: PayloadAction<DiemDanhStore>) => {
			return action.payload;
		},
	},
});

export const { updateDiemDanh } = diemDanh.actions;

export default diemDanh.reducer;
