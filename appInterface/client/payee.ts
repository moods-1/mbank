import { getToken } from '@/lib/clientFunctions';
import { getAllPayees } from '../actions/payeeActions';
import { PayeeReturnType } from '@/lib/types';

export const getPayees = async (): Promise<PayeeReturnType | null | {}> => {
	const token: string = await getToken();
	const result = await getAllPayees(token);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};
