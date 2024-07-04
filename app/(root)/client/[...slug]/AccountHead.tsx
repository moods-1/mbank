'use client';

import { useEffect, useState } from 'react';

import { useAppSelector } from '@/lib/store/store';
import { SlideLoader } from '@/components/Loaders';

interface Props {
	id: string;
}

export default function AccountHead({ id }: Props) {
	const [accountName, setAccountName] = useState('');
	const [balance, setBalance] = useState('');

	const { accounts } = useAppSelector((state) => state.client);

	useEffect(() => {
		const account = accounts.find((a) => a._id === id);
		if (account) {
			const { accountBalance, accountName } = account;
			const localBalance = accountBalance.toLocaleString(undefined, {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			});
			setAccountName(accountName);
			setBalance(localBalance);
		}
	}, [accounts, id]);

	return (
		<>
			<p className='text-lg sm:text-xl font-semibold'>
				{accountName || <SlideLoader className='h-6 max-w-96' />}
			</p>
			<p className='text-sm'>
				<span className='font-semibold'>Account number:</span>{' '}
				<span className='font-medium'>{id}</span>
			</p>
			<p className='flex text-sm'>
                <span className='font-semibold'>Balance:&nbsp;</span>
				{balance ? (
					<span className='font-medium'>{`$${balance}`}</span>
				) : (
					<SlideLoader className='h-6 max-w-40' />
				)}
			</p>
		</>
	);
}
