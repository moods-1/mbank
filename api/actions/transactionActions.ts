'use server';

import { Types } from 'mongoose';

import { NewTransactionType } from '@/lib/types';
import { connectToDatabase } from '../db';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import { handleError } from '@/lib/serverFunctions';

export async function addTransaction(data: NewTransactionType) {
	try {
		await connectToDatabase();
		const { amount, account: targetAccount, credit } = data;
		const targetAcc = await Account.findOne({ _id: targetAccount });
		if (targetAcc) {
			let newBalance: number;
			const { accountBalance } = targetAcc;
			if (credit) {
				newBalance = accountBalance + amount;
			} else {
				newBalance = accountBalance - amount;
			}
			if (newBalance >= 0) {
				data.amount = credit ? amount : -parseFloat(amount.toString());
				const transaction = await Transaction.create(data);
				const { _id, account } = transaction;
				await Account.updateOne(
					{ _id: account },
					{ accountBalance: newBalance, $push: { transactions: _id } }
				);
				return JSON.parse(JSON.stringify(transaction));
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
		return JSON.parse(JSON.stringify(transaction));
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
