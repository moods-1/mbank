import { getToken } from '@/lib/clientFunctions';
import { addPayee, removePayee, updateClient } from '../actions/clientActions';
import { AddPayeeReturnType, PayeeProps, PublicClientType, StatusMsgReturn, UpdateClientType } from '@/lib/types';

export const token: string = getToken();

export const payeeAdd = async (
	data: PayeeProps,
): Promise<AddPayeeReturnType | null | {}> => {
	const result = await addPayee(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const payeeRemove = async (
	data: PayeeProps,
): Promise<StatusMsgReturn | null | {}> => {
	const result = await removePayee(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

export const clientUpdate = async (
	data: UpdateClientType,
): Promise<PublicClientType | null | {}> => {
	const result = await updateClient(token, data);
	if (result && Object.keys(result)) {
		return result;
	}
	return null;
};

