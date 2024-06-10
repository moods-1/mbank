import { formatCurrency, formatDate } from '@/lib/clientFunctions';
import { TransactionReturnType } from '@/lib/types';

export default function TransactionItem({
	transaction,
}: {
	transaction: TransactionReturnType;
}) {
	const {
		amount,
		transactionDate,
		destinationName,
		credit,
		accountBalance,
	} = transaction;
	const currency = `$${formatCurrency(amount)}`;
	const formattedAmount = credit ? currency : `-${currency}`;
	const formattedBalance = `$${formatCurrency(accountBalance)}`;

	return (
		<div className='border-b'>
			<div className='transaction-item'>
				<p className='font-semibold'>{destinationName}</p>
				<p>
					<span>Date</span>
					<span>{formatDate(transactionDate, 'DD-MMM-YYYY')}</span>
				</p>
				<p>
					<span className='font-medium'>Amount</span>{' '}
					<span>{formattedAmount}</span>
				</p>
				<p>
					<span className='font-medium'>Balance</span>{' '}
					<span>{formattedBalance}</span>
				</p>
			</div>
		</div>
	);
}
