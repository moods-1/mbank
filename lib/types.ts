import { Types } from 'mongoose';

export type TransactionType = {
	_id: Types.ObjectId;
	clientNumber: number;
	account: Types.ObjectId;
	transactionDate: Date;
	amount: number;
	counterParty: string;
};

export type NewTransactionType = {
	clientNumber: number;
	account: Types.ObjectId | string;
	transactionDate: Date;
	amount: number;
	counterParty: string;
	credit: boolean;
};

export type AccountType = {
	_id: Types.ObjectId | string;
	clientNumber: number;
	accountName: string;
	accountType: string;
	accountBalance: number;
	transactions: Types.ObjectId[];
};

export type AddAccountType = {
	clientNumber: number;
	accountName: string;
	accountType: string;
	accountBalance: number;
	transactions: Types.ObjectId[];
};

export type AddClientType = {
	clientNumber?: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	password: string;
	image?: string;
};

export type ClientType = {
	_id?: Types.ObjectId | string;
	clientNumber?: number;
	firstName: string;
	lastName: string;
	loggedIn: boolean;
	email: string;
	phoneNumber: number;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	password: string;
	token?: string;
	image?: string;
	createdAt?: Date;
	updatedAt?: Date;
	accounts?: Types.ObjectId[];
};

export type PublicClientType = {
	_id?: Types.ObjectId | string;
	clientNumber: number;
	firstName: string;
	lastName: string;
	loggedIn: boolean;
	email: string;
	phoneNumber: number;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	token: string;
	image?: string;
	accounts: Types.ObjectId[];
};

export type LoginProps = {
	clientNumber: number;
	password: string;
};

export type GetAccountDetailsProps = {
	id: Types.ObjectId | string;
	filter: {
		startDate: Date;
		endDate: Date;
		minAmount: number;
		maxAmount: number;
	};
};

export type AccountDetailsProps = {
	msg?: string;
	status?: number;
	account?: AccountType;
	transactions?: TransactionType[];
};

export type AccounyByIdProps = {
	id: Types.ObjectId | string;
};

export type GetAccountsReturn = {
	status: number;
	msg: string;
	response: AccountType[];
};
