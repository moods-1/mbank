import { getToken } from '@/lib/clientFunctions';
import { getAccountsById ,  getAccountDetails} from '../actions/accountActions';
import { GetAccountsReturn, AccountDetailsProps, GetAccountDetailsProps } from '@/lib/types';
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

