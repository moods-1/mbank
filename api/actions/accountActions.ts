'use server';

import { Types } from 'mongoose';

import {
	AccountDetailsProps,
	AccountType,
	AddAccountType,
	GetAccountDetailsProps,
	GetAccountsReturn,
	TransactionType,
} from '@/lib/types';
import { connectToDatabase } from '../db';
import Account from '../models/Account';
import Client from '../models/Client';
import Transaction from '../models/Transaction';
import { handleError, verifyToken } from '@/lib/serverFunctions';

export async function addAccount(data: AddAccountType) {
	try {
		await connectToDatabase();
		const account = await Account.create(data);
		const { clientNumber, _id } = account;
		await Client.updateOne({ clientNumber }, { $push: { accounts: _id } });
		return JSON.parse(JSON.stringify(account));
	} catch (error) {
		handleError(error);
	}
}

export async function getAccountsById(
	token: string,
	data: Types.ObjectId[] | string[]
) {
	try {
		await verifyToken(token);
		await connectToDatabase();
		const accounts: AccountType[] | null = await Account.find({
			_id: { $in: data },
		});
		const response: GetAccountsReturn = {
			status: 200,
			msg: 'OK',
			response: JSON.parse(JSON.stringify(accounts)),
		};
		return response;
	} catch (error) {
		return handleError(error);
	}
}

export async function getAccountById(id: Types.ObjectId | string) {
	try {
		await connectToDatabase();
		const account = await Account.findOne({ _id: id });
		return JSON.parse(JSON.stringify(account));
	} catch (error) {
		handleError(error);
	}
}

export async function getAccountDetails(
	token: string,
	data: GetAccountDetailsProps
) {
	try {
		await verifyToken(token);
		await connectToDatabase();
		Transaction.syncIndexes();
		const { id, filter } = data;
		const { startDate, endDate, minAmount, maxAmount } = filter;
		const min = minAmount || Number.MIN_SAFE_INTEGER;
		const max = maxAmount || Number.MAX_SAFE_INTEGER;

		const accountResult: AccountType | null = await Account.findOne(
			{ _id: id },
			{ createdAt: 0, updatedAt: 0, __v: 0 }
		);

		const transactionsResult: TransactionType[] = await Transaction.find({
			account: id,
			transactionDate: { $gte: startDate, $lte: endDate },
			amount: { $gte: min, $lte: max },
		}).sort({ createdAt: -1 });
		
		const transactions: TransactionType[] = JSON.parse(
			JSON.stringify(transactionsResult)
		);
		const account: AccountType = JSON.parse(JSON.stringify(accountResult));

		const response: AccountDetailsProps = {
			status: 201,
			account,
			transactions,
		};
		return response;
	} catch (error) {
		return handleError(error);
	}
}
