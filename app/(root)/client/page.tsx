'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaUserEdit } from 'react-icons/fa';
import CountUp from 'react-countup';

import { balanceCalculator, partOfDayGreeting } from '@/lib/clientFunctions';
import { useAppSelector } from '@/lib/store/store';
import { SlideLoader } from '@/components/Loaders';
import { Button } from '@/components/ui/button';
import AddAccount from './ClientAddAccount';
import Profile from '@/components/profile/page';
import AccountCard from '@/components/AccountCard';
import { Mixpanel } from '@/components/Mixpanel';
import { AccountType } from '@/lib/types';

export default function ClientHome() {
	const [clientAccounts, setClientAccounts] = useState<AccountType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [firstName, setFirstName] = useState('');
	const [showAddAccount, setShowAddAccount] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const [totalBalance, setTotalBalance] = useState(0);
	const { client, accounts } = useAppSelector((state) => state.client);

	const noAccounts = !accounts.length && !isLoading;

	const openProfileChange = () => {
		setOpenProfile((prev) => !prev);
	};

	useEffect(() => {
		setFirstName(client.firstName);
		setTotalBalance(balanceCalculator(accounts, 'credit'));
		// Next line done for hydration errors
		setClientAccounts(accounts);
		setIsLoading(false);
	}, [client, accounts]);

	Mixpanel.track('MBank financial app accessed.', {
		action: 'MBank financial app accessed.',
	});

	return (
		<div>
			<div className='flex justify-between gap-4 flex-wrap mb-6'>
				<p className='text-xl sm:text-2xl flex flex-wrap'>
					<span className='min-w-40'>{partOfDayGreeting()}</span>
					{firstName ? (
						<span className='text-bank-green font-semibold'>{firstName}</span>
					) : (
						<SlideLoader className='!w-20' />
					)}
					.
				</p>
				<FaUserEdit
					className='text-2xl text-bank-green'
					role='button'
					onClick={() => setOpenProfile(true)}
				/>
			</div>
			<div className='flex flex-wrap flex-col lg:flex-row items-start gap-10 '>
				<div className='flex-1 min-w-60'>
					<div className=' mb-4'>
						<p className='font-semibold mb-4'>Growing balance with us:</p>
						<CountUp
							start={0}
							end={totalBalance}
							decimals={2}
							prefix='$'
							className='text-2xl xs:text-5xl font-semibold text-bank-green'
						/>
					</div>
					<p className='font-semibold mb-2 text-xl'>Your Accounts</p>
					{noAccounts ? (
						<div>No accounts</div>
					) : (
						<div className='flex flex-wrap justify-center xs:justify-normal gap-5 max-w-2xl'>
							{isLoading ? <SlideLoader className='h-44' /> : null}
							{clientAccounts.map((account, idx) => (
								<AccountCard
									key={idx}
									account={account}
									background='bg-black'
								/>
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
						priority
						src='/images/easy.png'
						width={300}
						height={300}
						alt='easy'
						className='mx-auto my-4 h-auto w-auto'
					/>
					<p>Are you ready to add an account?</p>
					<Button
						size={'sm'}
						className='mt-2 bg-bank-green px-6 green-button'
						onClick={() => setShowAddAccount((prev) => !prev)}
					>
						{`${showAddAccount ? 'Not now' : "Let's Go"}`}
					</Button>
					{showAddAccount ? (
						<AddAccount clientNumber={client.clientNumber} />
					) : null}
				</div>
			</div>
			<Profile open={openProfile} openChange={openProfileChange} />
		</div>
	);
}
