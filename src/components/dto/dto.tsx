export interface Status24 {
	old_bet: BetLog;
	result: string;
	server: string;
	new_bet: BetLog;
}

export interface StatusSv {
	type: string;
	sv: BetLog;
	server: string;
}

export interface StatusBoss {
	type: string;
	boss: BetLog;
	server: string;
}

export interface BetLog {
	_id: string;
	total: number;
	sendIn: number;
	sendOut: number;
	result: string;
	isEnd: boolean;
	server: string;
	timeEnd: Date;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface CreateUserBet {
	betId: any;
	uid: any;
	amount: number;
	result: string;
	server: string;
}

export interface userBet {
	_id: string;
	__v: number;
	uid: string;
	betId: string;
	amount: number;
	result: string;
	resultBet: string;
	server: string;
	receive: number;
	isEnd: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
