import Image from 'next/image';
import Link from 'next/link';

import SignalBars from '@/components/images/SignalBars';
import { AccountType } from '@/lib/types';
import { formatCurrency } from '@/lib/clientFunctions';
import { CLIENT_SLUG_ROUTES } from '@/lib/constants';

type Props = {
	background?: string;
	account: AccountType;
};

export default function CreditCard({ background, account }: Props) {
	const { accountBalance, accountName, _id } = account;
	const slugA = CLIENT_SLUG_ROUTES[accountName];
	return (
		<Link href={`/client/accounts/${slugA}/${_id}`}>
			<div
				className={`${
					background || 'dark-glass'
				} min-w-[250px] h-auto xs:min-w-72 xs:h-44 rounded-lg p-5 text-white`}
			>
				<p className='flex justify-between mb-8 font-medium'>
					<span className='text-xl text-bank-green'>MBank</span>
					<SignalBars className='rotate-90 w-6' />
				</p>
				<div className='text-xs xs:text-sm'>
					<p className='!text-lg card-numbers'>
						${formatCurrency(accountBalance)}
					</p>
					<p className='uppercase'>{accountName}</p>
					<p className='flex items-center justify-between mt-1'>
						<span />
						<span className='w-10'>
							<Image
								src='/images/MasterCard-sm.png'
								alt='mc'
								width={100}
								height={100}
							/>
						</span>
					</p>
				</div>
			</div>
		</Link>
	);
}
