import { getToken } from '@/lib/clientFunctions';
import { addTransaction } from '../actions/transactionActions';
import { NewTransactionType, PublicClientType } from '@/lib/types';

export const token: string = getToken();

export const transactionAdd = async (
	data: NewTransactionType
): Promise<PublicClientType | null | {}> => {
	const result = await addTransaction(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
