import { getToken } from '@/lib/clientFunctions';
import { addTransaction } from '../actions/transactionActions';
import { ClientNewTransactionType, PublicClientType } from '@/lib/types';

export const token: string = getToken();

export const transactionAdd = async (
	data: ClientNewTransactionType
): Promise<PublicClientType | null | {}> => {
	const result = await addTransaction(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
