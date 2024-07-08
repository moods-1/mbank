'use server';

import { Types } from 'mongoose';

import {
	AccountDetailsProps,
	AccountType,
	AddAccountType,
	ClientNewTransactionType,
	GetAccountDetailsProps,
	GetAccountsReturn,
	PaymentFormProps,
	ServerNewTransactionType,
	StatusMsgReturn,
	TransactionReturnType,
	TransactionType,
} from '@/lib/types';
import { connectToDatabase } from '../db';
import Account from '../models/Account';
import Client from '../models/Client';
import Transaction from '../models/Transaction';
import {
	handleError,
	parsedResponse,
	verifyToken,
} from '@/lib/serverFunctions';
import { DEBT_SET } from '@/lib/constants';
import ReferenceNumber from '../models/ReferenceNumber';

export async function addAccount(data: AddAccountType) {
	try {
		const { accountType } = data;
		const debt: boolean = DEBT_SET.has(accountType);
		await connectToDatabase();
		const account = await Account.create({ ...data, debt });
		const { clientNumber, _id } = account;
		const result = await Client.findOneAndUpdate(
			{ clientNumber },
			{ $push: { accounts: _id } },
			{ returnOriginal: false }
		);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		return handleError(error);
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
		}).sort({ accountName: 1 });
		const response: GetAccountsReturn = {
			status: 200,
			msg: 'OK',
			response: parsedResponse(accounts),
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
		return parsedResponse(account);
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
		if (accountResult) {
			const accountTransactions: Types.ObjectId[] = accountResult?.transactions;
			const transactionsResult: TransactionType[] = await Transaction.find({
				_id: { $in: accountTransactions },
				transactionDate: { $gte: startDate, $lte: endDate },
				amount: { $gte: min, $lte: max },
			}).sort({ createdAt: -1 });

			const transactions: TransactionReturnType[] = JSON.parse(
				JSON.stringify(transactionsResult)
			);
			const account: AccountType = parsedResponse(accountResult);
			const response: AccountDetailsProps = {
				status: 201,
				account,
				transactions,
			};
			return response;
		}
	} catch (error) {
		return handleError(error);
	}
}

export async function quickTransaction(data: ClientNewTransactionType) {
	const {
		amount,
		destinationId,
		sourceAccount,
		sourceAccountName,
		destinationName,
		credit,
	} = data;
	try {
		const referenceNumberArray = await ReferenceNumber.find();
		const { _id: numberId, referenceNumber } = referenceNumberArray[0];
		const newReferenceNumber = referenceNumber + 1;
		await ReferenceNumber.updateOne(
			{ _id: numberId },
			{ referenceNumber: newReferenceNumber }
		);
		//Update account being credited
		if (credit) {
			const targetAcc = await Account.findOne({ _id: destinationId });
			if (targetAcc) {
				let newBalance: number;
				const { accountBalance } = targetAcc;
				newBalance = accountBalance + Number(amount);
				const newData: ServerNewTransactionType = {
					...data,
					amount: Number(data.amount),
					destinationName: sourceAccountName,
					accountBalance: newBalance,
					referenceNumber: newReferenceNumber,
				};
				const transaction = await Transaction.create(newData);
				const { _id } = transaction;
				await Account.findOneAndUpdate(
					{ _id: destinationId },
					{ accountBalance: newBalance, $push: { transactions: _id } },
					{ returnOriginal: false }
				);
			}
		} else {
			// Update payment source account
			const targetAcc = await Account.findOne({ _id: sourceAccount });
			if (targetAcc) {
				let newBalance: number;
				const { accountBalance } = targetAcc;
				newBalance = accountBalance - Number(amount);
				if (newBalance >= 0) {
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
				}
			}
		}
		return {
			status: 201,
			msg: `Successful transfer of $${amount} to ${destinationName}. The reference number is ${newReferenceNumber}.`,
		};
	} catch (error) {
		return handleError(error);
	}
}

export async function quickTransfer(
	token: string,
	data: ClientNewTransactionType
) {
	const { clientId } = data;
	try {
		await verifyToken(token);
		await connectToDatabase();
		// Update to source account
		const debitData = { ...data, amount: Number(data.amount), credit: false };
		await quickTransaction(debitData);
		// Update to destination account
		const creditData = { ...data, amount: Number(data.amount), credit: true };
		const transferData: StatusMsgReturn = await quickTransaction(creditData);
		const { msg, status } = transferData;
		const result = await Client.findOne({ _id: clientId });
		if (result) {
			const accountsArr = result.accounts;
			const accounts: AccountType[] = await Account.find({
				_id: { $in: accountsArr },
			}).sort({ accountName: 1 });
			return { status, msg, response: parsedResponse(accounts) };
		}
	} catch (error) {
		return handleError(error);
	}
}
