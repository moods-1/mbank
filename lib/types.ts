import { Types } from 'mongoose';

export type TransactionType = {
	_id: Types.ObjectId | string;
	client: Types.ObjectId | string;
	account: Types.ObjectId | string;
	transactionDate: Date;
	amount: number;
};

export type AccounType = {
	_id: Types.ObjectId | string;
	accountName: string;
	accountBalance: number;
	transactions: Types.ObjectId | string[];
};

export type ClientType = {
	_id?: Types.ObjectId | string;
	firstName: string;
	lastName: string;
	loggedIn: boolean;
	email: string;
	phoneNumber: number;
	password: string;
	image: string;
	createdAt: Date;
	updatedAt: Date;
	accounts: Types.ObjectId[];
};
