import { formatCurrency, formatDate } from '@/lib/clientFunctions';
import { AccountType, TransactionType } from '@/lib/types';
import Link from 'next/link';

export default function TransactionItem({
	transaction,
}: {
	transaction: TransactionType;
}) {
	const { amount, transactionDate, _id, counterParty } = transaction;
	const displayId = _id.toString().slice(-8);
	return (
		<div className='border-b'>
			<div className='transaction-item'>
				<p>
					<span>Source</span>
					<span>{counterParty}</span>
				</p>
				<p>
					<span>Transaction#</span>
					<span>{displayId}</span>
				</p>
				<p>
					<span>Date</span>
					<span>{formatDate(transactionDate)}</span>
				</p>
				<p>
					<span className='font-medium'>Amount</span>{' '}
					<span>${formatCurrency(amount)}</span>
				</p>
			</div>
		</div>
	);
}
