import { Types } from 'mongoose';

export type TransactionType = {
	_id: Types.ObjectId;
	clientNumber: number;
	account: Types.ObjectId;
	transactionDate: Date;
	amount: number;
	destinationName: string;
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

export type AddAccountFormType = {
	clientNumber: string|number;
	accountName: string; 
	accountType: string;
}

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
	province: string;
	country: string;
	address: string;
	postalCode: string;
	password: string;
	image?: string;
};

export type UpdateClientType = {
	_id: Types.ObjectId | string;
	clientNumber?: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
	city: string;
	province: string;
	country: string;
	address: string;
	postalCode: string;
	password?: string;
	newPassword: boolean;
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
	province: string;
	password: string;
	token?: string;
	image?: string;
	createdAt?: Date;
	updatedAt?: Date;
	accounts?: Types.ObjectId[];
};
export type PayeeType = {
	_id?: Types.ObjectId | string;
	payeeName: string;
	nickname?: string;
	email: string;
	businessType: string;
	phoneNumber: number;
	city: string;
	country: string;
	address: string;
	postalCode: string;
	createdAt?: Date;
	updatedAt?: Date;
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
	province: string;
	country: string;
	address: string;
	postalCode: string;
	token: string;
	image?: string;
	accounts: Types.ObjectId[];
	payees: PayeeProps[];
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
	transactions?: TransactionReturnType[];
};

export type AccounyByIdProps = {
	id: Types.ObjectId | string;
};

export type GetAccountsReturn = {
	status: number;
	msg: string;
	response: AccountType[];
};

export type PayeeProps = {
	_id?: Types.ObjectId | string | any;
	payeeId: Types.ObjectId | string | any;
	payeeName?: string;
	clientNumber?: number;
	accountNumber: string;
	nickname?: string;
};

export type StatusMsgReturn = {
	status: number;
	msg: string;
};

export type PayeeReturnType = {
	status: number;
	msg: string;
	response: PayeeType[];
};
export type AddPayeeReturnType = {
	status: number;
	msg: string;
	response: PublicClientType;
};

export type PaymentFormProps = {
	transactionDate: Date;
	destinationId: Types.ObjectId | string;
	destinationName: string | undefined;
	amount: number | string;
	clientId: Types.ObjectId | string | undefined;
	sourceAccount: Types.ObjectId | string;
	sourceAccountName: string;
	accountBalance: number;

};

export type ClientNewTransactionType = {
	transactionDate: Date;
	destinationId: Types.ObjectId | string;
	destinationName: string | undefined;
	amount: number|string;
	clientId: Types.ObjectId | string | undefined;
	sourceAccount: Types.ObjectId | string;
	sourceAccountName: string;
	credit: boolean;
};

export type ServerNewTransactionType = {
	transactionDate: Date;
	destinationId: Types.ObjectId | string;
	destinationName: string | undefined;
	amount: number;
	clientId: Types.ObjectId | string | undefined;
	sourceAccount: Types.ObjectId | string;
	sourceAccountName: string;
	credit: boolean;
	accountBalance: number;
};

export type TransactionReturnType = {
	_id: Types.ObjectId | string;
	transactionDate: Date;
	destinationId: Types.ObjectId | string;
	destinationName: string | undefined;
	amount: number;
	clientId: Types.ObjectId | string | undefined;
	sourceAccount: Types.ObjectId | string;
	sourceAccountName: string;
	credit: boolean;
	accountBalance: number;
};

export type TableHeaderType = {
	label: string;
	field: string;
	filterable: boolean;
};

export type AccountSelectType = {
	value: string;
	disabled: boolean;
};