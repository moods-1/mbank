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
import ReferenceNumber from '../models/ReferenceNumber';
import {
	handleError,
	parsedResponse,
	setDateRange,
	verifyToken,
	handlePagination
} from '@/lib/serverFunctions';

export async function addTransaction(
	token: string,
	data: ClientNewTransactionType
) {
	try {
		await verifyToken(token);
		await connectToDatabase();
		ReferenceNumber.syncIndexes();
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
			const referenceNumberArray = await ReferenceNumber.find();
			const { _id: numberId, referenceNumber } = referenceNumberArray[0];
			const newReferenceNumber = referenceNumber + 1;
			await ReferenceNumber.updateOne(
				{ _id: numberId },
				{ referenceNumber: newReferenceNumber }
			);
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
						referenceNumber: newReferenceNumber,
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
						return {
							response: parsedResponse(accounts),
							status: 201,
							msg: `Successful payment of $${amount} to ${destinationName}. The reference number is ${newReferenceNumber}.`,
						};
					}
				}
				// For future payments
				return {
					status: 201,
					msg: `Your payment of $${amount} to ${destinationName} has been scheduled for ${date}. The reference number is ${newReferenceNumber}.`,
				};
			} else {
				return {
					status: 400,
					msg: `Your ${sourceAccountName} has insufficient funds. Please make sure $${amount} is in the account on ${date}, or the payment will not be made. The reference number is ${newReferenceNumber}.`,
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
		const { dateStart, dateEnd } = await setDateRange(startDate, endDate);
		const transactionsResult: TransactionType[] = await Transaction.find({
			_id: { $in: transactions },
			transactionDate: { $gte: dateStart, $lte: dateEnd },
			amount: { $gte: min, $lte: max },
		}).sort({ createdAt: -1 });
		const result = parsedResponse(transactionsResult);
		const { data, totalPages, hasMore } = await handlePagination(result, page, size);
		const response = { data, totalPages, hasMore };
		return { status: 201, msg: 'Ok', response };
	} catch (error) {
		return handleError(error);
	}
}
