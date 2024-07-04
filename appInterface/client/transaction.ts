import { getToken } from '@/lib/clientFunctions';
import { addTransaction, getTransactions } from '../actions/transactionActions';
import { ClientNewTransactionType, GetTransactionsType, PublicClientType, TransactionsReturnType } from '@/lib/types';

export const transactionAdd = async (
	data: ClientNewTransactionType
): Promise<PublicClientType | null | {}> => {
	const token: string = await getToken();
	const result = await addTransaction(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const fetchTransactions = async (queryData: GetTransactionsType): Promise<TransactionsReturnType> => {
	const token: string = await getToken();
	const result = await getTransactions(token, queryData);
	return result;
}