interface Result {
	'0'?: string;
	'1'?: string;
	C?: string;
	L?: string;
	T?: string;
	X?: string;
	CT?: string;
	LX?: string;
	LT?: string;
	CX?: string;
	[key: string]: string | undefined;
}

export const TranslateKey: Result = {
	'0': 'Khỉ Đỏ',
	'1': 'Khỉ Đen',
	C: 'Chẵn',
	L: 'Lẻ',
	T: 'Tài',
	X: 'Xỉu',
	CT: 'Chẵn Tài',
	LX: 'Lẻ Xỉu',
	LT: 'Lẻ Tài',
	CX: 'Chẵn Xỉu',
};
