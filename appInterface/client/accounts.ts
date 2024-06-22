import { getToken } from '@/lib/clientFunctions';
import {
	getAccountsById,
	getAccountDetails,
	quickTransfer,
	addAccount,
} from '../actions/accountActions';
import {
	GetAccountsReturn,
	AccountDetailsProps,
	GetAccountDetailsProps,
	PublicClientType,
	PaymentFormProps,
	AddAccountFormType,
	AddAccountType,
} from '@/lib/types';
import { Types } from 'mongoose';

export const getAccounts = async (
	data: Types.ObjectId[]
): Promise<GetAccountsReturn | null | {}> => {
	const token: string = await getToken();
	const result = await getAccountsById(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const getAccDetails = async (
	data: GetAccountDetailsProps
): Promise<AccountDetailsProps | null> => {
	const token: string = await getToken();
	const result = await getAccountDetails(token, data);
	return result ? result : null;
};

export const transferQuick = async (
	data: PaymentFormProps
): Promise<PublicClientType | null | {}> => {
	const token: string = await getToken();
	const result = await quickTransfer(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const accountAdd = async (
	data: AddAccountFormType
): Promise<PublicClientType | null> => {
	let queryData: AddAccountType;
	const transactions: Types.ObjectId[] = [];
	queryData = {
		...data,
		clientNumber: Number(data.clientNumber),
		transactions,
		accountBalance: 0,
	};
	const result = await addAccount(queryData);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
