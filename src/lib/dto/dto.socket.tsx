export interface DiemDanhRe {
	status: boolean;
	msg: string;
	uid: string;
	length: number;
}

export interface DiemDanhResult {
	ip_address: string;
	_id: string;
	username: string;
	email: string;
	name: string;
	gold: number;
	diamon: number;
	clan: string;
	totalBet: number;
	limitedTrade: number;
	isBan: boolean;
	isReason: string;
	server: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	trade: number;
	avatar: string;
	totalBank: number;
	type: string;
	vip: number;
}

export interface DiemDanhGot {
	length: number;
	status: boolean;
	msg: string;
	uid: string;
	token: string;
}

export type DiemDanhLive = '0' | '1' | '2';
