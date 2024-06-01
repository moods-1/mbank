import { CLIENT_SLUG_ROUTES } from '@/lib/constants';
import { AccountType } from '@/lib/types';
import Link from 'next/link';

export default function AccountItem({ account }: { account: AccountType }) {
	const { accountName, accountBalance, _id } = account;
	const displayNumber = _id.toString().slice(-4);
	const slugA = CLIENT_SLUG_ROUTES[accountName];
	return (
		<Link href={`/client/accounts/${slugA}/${_id}`} className='border-b'>
			<div className='account-item'>
				<p>
					<span className='font-medium'>{accountName}</span> {displayNumber}
				</p>
				<p>
					$
					{accountBalance.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</div>
		</Link>
	);
}
