'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';

import { partOfDayGreeting } from '@/lib/clientFunctions';
import { useAppSelector } from '@/lib/store/store';
import AccountItem from './AccountItem';
import { AccountType } from '@/lib/types';
import { SlideLoader } from '@/components/Loaders';
import DoubleSlider from '@/components/DoubleSlider';
import { Button } from '@/components/ui/button';
import { getAccounts } from '@/api/client/accounts';
import { useAppDispatch } from '@/lib/store/store';
import { loadAccounts, logoutClient } from '@/lib/store/clientSlice';

export default function ClientHome() {
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [firstName, setFirstName] = useState('');
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { client } = useAppSelector((state) => state.client);

	const noAccounts = !accounts.length && !isLoading;

	useEffect(() => {
		setFirstName(client.firstName);
	}, [client]);

	useEffect(() => {
		const fetchAccounts = async () => {
			setIsLoading(true);
			try {
				const { accounts } = client;
				const result = await getAccounts(accounts);
				if (result && 'response' in result) {
					const { response } = result;
					setAccounts(response);
					dispatch(loadAccounts(response));
				} else if (result && 'msg' in result && 'status' in result) {
					const { status, msg } = result;
					if (status === 401) {
						dispatch(logoutClient());
						router.push('/');
						if (typeof msg === 'string') {
							return toast.error(msg);
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};
		fetchAccounts();
	}, [client, dispatch, router]);

	return (
		<div>
			<p className='text-xl mb-6 flex'>
				{partOfDayGreeting()}
				{firstName || <SlideLoader className='!w-20' />}.
			</p>
			<div className='flex flex-wrap gap-10'>
				<div className='flex-1 min-w-60'>
					<p className='font-semibold mb-2'>Your Accounts</p>
					{noAccounts ? (
						<div>No accounts</div>
					) : (
						<div className='flex flex-col border max-w-2xl'>
							{isLoading ? <DoubleSlider /> : null}
							{accounts.map((account, idx) => (
								<AccountItem key={idx} account={account} />
							))}
						</div>
					)}
				</div>
				<div className='card flex-1 min-w-60 max-w-lg border'>
					<p className='text-lg sm:text-xl font-semibold'>
						{
							"We're here to make your banking experience easy like Sunday morning."
						}
					</p>
					<Image
						src='/images/easy.png'
						width={300}
						height={300}
						alt='easy'
						className='mx-auto my-4 h-auto w-auto'
					/>
					<p>Are you ready to add an account?</p>
					<Button className='mt-2 bg-bank-green rounded-full px-6'>
						{"Let's Go"}
					</Button>
				</div>
			</div>
			<ToastContainer theme='dark' position='bottom-left' />
		</div>
	);
}
