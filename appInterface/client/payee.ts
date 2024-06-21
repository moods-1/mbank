import { getToken } from '@/lib/clientFunctions';
import { getAllPayees } from '../actions/payeeActions';
import { PayeeReturnType } from '@/lib/types';

export const token: string = getToken();

export const getPayees = async (): Promise<PayeeReturnType | null | {}> => {
	const result = await getAllPayees(token);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
