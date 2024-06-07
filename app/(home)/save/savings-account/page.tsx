'use client';

import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { transactionAdd } from '@/api/client/transaction';
import { useAppSelector, useAppDispatch } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import { Types } from 'mongoose';

const accounts = {
	chequing: '6657782e79dc3ac7662cbd2c',
	tfsa: '6655db86ba65082ea6587e88',
	savings: '6654e56d63a5d8dbadb3d264',
};

const mongoId = new Types.ObjectId('6000000aac0fc18695d23aa0');

export default function SavingsAccount() {
	const { client } = useAppSelector((state) => state.client);
	const dispatch = useAppDispatch();

	const TransactionData = {
		transactionDate: new Date(),
		destinationId: mongoId,
		destinationName: 'Ambrosia Natural Foods',
		amount: 45.35,
		clientId: client._id,
		sourceAccount: Object.values(accounts)[0],
		credit: false,
	};

	const handleAddTransaction = async () => {
		try {
			const result = await transactionAdd(TransactionData);
			if (result && 'firstName' in result) {
				dispatch(updateClient(result));
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main>
			<PageHeader
				title='Savings'
				subtitle='Earn a great interest rate on your Savings Account.'
			/>
			<section>
				<Button onClick={handleAddTransaction}>Add Transaction</Button>
			</section>
		</main>
	);
}
