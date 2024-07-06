'use server';

import { Types } from 'mongoose';

import { formatDate } from '@/lib/clientFunctions';
import {
	AccountType,
	ClientNewTransactionType,
	GetTransactionsType,
	ServerNewTransactionType,
	TransactionType,
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
			destinationName,
			credit,
			clientId,
			transactionDate,
		} = data;
		const sourceAcc = await Account.findOne({ _id: sourceAccount });
		const date = formatDate(transactionDate, 'DD-MMM-YYYY');
		if (sourceAcc) {
			let newBalance: number;
			const { accountBalance } = sourceAcc;
			if (credit) {
				newBalance = accountBalance + Number(amount);
			} else {
				newBalance = accountBalance - Number(amount);
			}
			if (newBalance >= 0) {
				const today = new Date().toLocaleDateString();
				const payToday = today === transactionDate.toLocaleDateString();
				if (payToday) {
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
					if (result) {
						const accountsArr = result.accounts;
						const accounts: AccountType[] = await Account.find({
							_id: { $in: accountsArr },
						}).sort({ accountName: 1 });					
						return parsedResponse(accounts);
					}
				}
				// For future payments 
				return { status: 201, msg: `Your payment of $${amount} to ${destinationName} has been scheduled for ${date}.` };
			} else {
				return {
					status: 400,
					msg: `Your ${sourceAccountName} has insufficient funds. Please make sure $${amount} is in the account on ${date}, or the payment will not be made.`,
				};
			}
		}
		return { status: 500, msg: `${sourceAccountName} could not be found.` };
	} catch (error) {
		return handleError(error);
	}
}

export async function getTransactionById(id: Types.ObjectId | string) {
	try {
		await connectToDatabase();
		const transaction = await Transaction.findOne({ _id: id });
		return parsedResponse(transaction);
	} catch (error) {
		return handleError(error);
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
		return handleError(error);
	}
}

export async function getTransactions(
	token: string,
	queryData: GetTransactionsType
) {
	const { page, size, startDate, endDate, min, max, transactions } = queryData;
	try {
		await verifyToken(token);
		await connectToDatabase();
		const transactionsResult: TransactionType[] = await Transaction.find({
			_id: { $in: transactions },
			transactionDate: { $gte: startDate, $lte: endDate },
			amount: { $gte: min, $lte: max },
		}).sort({ createdAt: -1 });

		const result = parsedResponse(transactionsResult);
		const totalDocs = result.length;
		const totalPages = Math.ceil(totalDocs / size);
		const endIndex = page * size;
		const startIndex = endIndex - size;
		const data = result.slice(startIndex, endIndex);
		const hasMore = endIndex < totalDocs;
		const response = { data, totalPages, hasMore };
		return { status: 201, msg: 'Ok', response };
	} catch (error) {
		return handleError(error);
	}
}
