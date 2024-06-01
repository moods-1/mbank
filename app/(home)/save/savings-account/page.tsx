'use client';

import { addAccount } from '@/api/actions/accountActions';
import { Button } from '@/components/ui/button';
import React from 'react';
import {
	addTransaction,
	moveTransctions,
} from '@/api/actions/transactionActions';
import { useAppSelector } from '@/lib/store/store';
import { useAppDispatch } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import { getToken } from '@/lib/clientFunctions';

export default function SavingsAccount() {
	const { client } = useAppSelector((state) => state.client);
	const dispatch = useAppDispatch();

	const data = {
		clientNumber: 800000001,
		accountName: 'No-Fee Chequing Account',
		accountType: '004',
		accountBalance: 75000,
		transactions: [],
	};
	const transactionData = {
		clientNumber: 800000001,
		account: '6655db86ba65082ea6587e88',
		transactionDate: new Date(),
		amount: 88000,
		counterParty: 'Savings Account d264',
		credit: true,
	};

	const handleAddAccount = async () => {
		try {
			const result = await addAccount(data);
			const localClient = { ...client };
			const { _id } = result;
			localClient.accounts.push(_id);
			dispatch(updateClient(localClient));
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddTransaction = async () => {
		try {
			const result = await addTransaction(transactionData);
			console.log({ result });
		} catch (error) {
			console.log(error);
		}
	};

	const handleMoveTransactions = async () => {
		try {
			const result = await moveTransctions();
			console.log({ result });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main>
			<section>
				<p className='page-title'>General Savings</p>
				<Button onClick={handleAddAccount}>Add Account</Button> <br />
				<br />
				<Button onClick={handleAddTransaction}>Add Transaction</Button>
				<br />
				<br />
				{/* <Button onClick={handleMoveTransactions}>Move Transactions</Button>
				<br />
				<br /> */}
				<Button onClick={() => console.log(getToken())}>Get Client</Button>
			</section>
		</main>
	);
}
