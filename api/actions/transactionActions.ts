'use server';

import { Types } from 'mongoose';

import { formatDate } from '@/lib/clientFunctions';
import {
	ClientNewTransactionType,
	ServerNewTransactionType,
} from '@/lib/types';
import { connectToDatabase } from '../db';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Client from '../models/Client';
import {
	handleError,
	parsedResponse,
	verifyToken,
} from '@/lib/serverFunctions';

export async function addTransaction(
	token: string,
	data: ClientNewTransactionType
) {
	Account.syncIndexes();
	Transaction.syncIndexes();
	try {
		await verifyToken(token);
		await connectToDatabase();
		const {
			amount,
			sourceAccount,
			sourceAccountName,
			credit,
			clientId,
			transactionDate,
		} = data;
		const sourceAcc = await Account.findOne({ _id: sourceAccount });
		console.log({ sourceAcc });
		if (sourceAcc) {
			let newBalance: number;
			const { accountBalance } = sourceAcc;
			if (credit) {
				newBalance = accountBalance + Number(amount);
			} else {
				newBalance = accountBalance - Number(amount);
			}
			console.log({ data });
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
				const date = formatDate(transactionDate, 'DD-MMM-YYYY');
				return {
					status: 201,
					msg: `Your ${sourceAccountName} has insufficient funds. Please make sure $${amount} is in the account on ${date}, or the payment will not be made.`,
				};
			}
		}
		return { status: 500, msg: `${sourceAccountName} could not be found.` };
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
