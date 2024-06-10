import { getToken } from '@/lib/clientFunctions';
import {
	getAccountsById,
	getAccountDetails,
	quickTransfer,
} from '../actions/accountActions';
import {
	GetAccountsReturn,
	AccountDetailsProps,
	GetAccountDetailsProps,
	ClientNewTransactionType,
	PublicClientType,
	PaymentFormProps,
} from '@/lib/types';
import { Types } from 'mongoose';

export const token: string = getToken();

export const getAccounts = async (
	data: Types.ObjectId[]
): Promise<GetAccountsReturn | null | {}> => {
	const result = await getAccountsById(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const getAccDetails = async (
	data: GetAccountDetailsProps
): Promise<AccountDetailsProps | null> => {
	const result = await getAccountDetails(token, data);
	return result ? result : null;
};

export const transferQuick = async (
	data: PaymentFormProps
): Promise<PublicClientType | null | {}> => {
	const result = await quickTransfer(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
