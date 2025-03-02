import { getToken } from '@/lib/clientFunctions';
import { addTransaction, getTransactions } from '../actions/transactionActions';
import {
	AccountType,
	AddTransactionReturn,
	ClientNewTransactionType,
	GetTransactionsType,
	TransactionsReturnType,
} from '@/lib/types';

export const transactionAdd = async (
	data: ClientNewTransactionType
): Promise<AddTransactionReturn> => {
	const token: string = await getToken();
	const result = await addTransaction(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return {
		status: 500,
		msg: 'Sorry, we could not process that transaction.',
	};
};

export const fetchTransactions = async (
	queryData: GetTransactionsType
): Promise<TransactionsReturnType> => {
	const token: string = await getToken();
	const result = await getTransactions(token, queryData);
	return result;
};
