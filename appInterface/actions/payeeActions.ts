'use server';

import { PayeeReturnType, PayeeType } from '@/lib/types';
import { connectToDatabase } from '../db';
import Payee from '../models/Payee';
import {
	handleError,
	parsedResponse,
	verifyToken,
} from '@/lib/serverFunctions';

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
		const result = await Payee.find().sort({ payeeName: 1 });
		const response: PayeeReturnType = {
			status: 201,
			msg: 'Ok',
			response: parsedResponse(result),
		};
		return response;
	} catch (error) {
		return handleError(error);
	}
}
