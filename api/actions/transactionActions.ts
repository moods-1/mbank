'use server';

import { Types } from 'mongoose';

import {
	ClientNewTransactionType,
	ServerNewTransactionType,
} from '@/lib/types';
import { connectToDatabase } from '../db';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Client from '../models/Client';
import { handleError, parsedResponse, verifyToken } from '@/lib/serverFunctions';

export async function addTransaction(
	token: string,
	data: ClientNewTransactionType
) {
	Account.syncIndexes();
	Transaction.syncIndexes();
	try {
		await verifyToken(token);
		await connectToDatabase();
		const { amount, sourceAccount, credit, clientId } = data;
		const targetAcc = await Account.findOne({ _id: sourceAccount });
		if (targetAcc) {
			let newBalance: number;
			const { accountBalance } = targetAcc;
			if (credit) {
				newBalance = accountBalance + Number(amount);
			} else {
				newBalance = accountBalance - Number(amount);
			}
			if (newBalance >= 0) {
				const newData: ServerNewTransactionType = {
					...data,
					amount: Number(data.amount),
					accountBalance: newBalance,
				};
				const transaction = await Transaction.create(newData);
				const { _id } = transaction;
				await Account.updateOne(
					{ _id: sourceAccount },
					{ accountBalance: newBalance, $push: { transactions: _id } }
				);
				const result = await Client.findOne({ _id: clientId });
				return parsedResponse(result);
			} else {
				throw new Error('Insufficient funds in this account.');
			}
		}
		return {};
	} catch (error) {
		handleError(error);
	}
}

export async function getTransactionById(id: Types.ObjectId | string) {
	try {
		await connectToDatabase();
		const transaction = await Transaction.findOne({ _id: id });
		return parsedResponse(transaction);
	} catch (error) {
		handleError(error);
	}
}

export async function moveTransctions() {
	try {
		await connectToDatabase();
		await Transaction.updateMany(
			{ account: '6654e56d63a5d8dbadb3d264' },
			{ account: '6657782e79dc3ac7662cbd2c' }
		);
		const transactions = await Transaction.find({
			account: '6657782e79dc3ac7662cbd2c',
		});
		await Account.updateOne(
			{ _id: '6657782e79dc3ac7662cbd2c' },
			{ $push: { transactions } }
		);
		await Account.updateOne(
			{ _id: '6654e56d63a5d8dbadb3d264' },
			{ $set: { transactions: [] } }
		);
		return {};
	} catch (error) {
		handleError(error);
	}
}
