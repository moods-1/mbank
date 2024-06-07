'use server';

import { PayeeReturnType, PayeeType } from '@/lib/types';
import { connectToDatabase } from '../db';
import Payee from '../models/Payee';
import { handleError, verifyToken } from '@/lib/serverFunctions';


export async function adminAddPayee(data: PayeeType) {
	try {
		await connectToDatabase();
		await Payee.create(data);
		return { status: 201, msg: 'Payee added.' };
	} catch (error) {
		handleError(error);
	}
}

export async function getAllPayees(token: string) {
	try {
		await verifyToken(token);
		await connectToDatabase();
		const result = await Payee.find();
		const response: PayeeReturnType = {
			status: 201,
			msg: 'Ok',
			response: JSON.parse(JSON.stringify(result)),
		};
		return response;
	} catch (error) {
		return handleError(error);
	}
}
