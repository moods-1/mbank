'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserEdit } from 'react-icons/fa';
import CountUp from 'react-countup';

import {
	accountsDonutChartData,
	balanceCalculator,
	partOfDayGreeting,
} from '@/lib/clientFunctions';
import { useAppSelector } from '@/lib/store/store';
import AccountItem from './AccountItem';
import { AccountType } from '@/lib/types';
import { SlideLoader } from '@/components/Loaders';
import DoubleSlider from '@/components/DoubleSlider';
import { Button } from '@/components/ui/button';
import { getAccounts } from '@/api/client/accounts';
import { useAppDispatch } from '@/lib/store/store';
import { loadAccounts, logoutClient } from '@/lib/store/clientSlice';
import AddAccount from './admin/ClientAddAccount';
import Profile from '@/components/profile/page';
import DonutChart from '@/components/charts/DonutChart';

export default function ClientHome() {
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [firstName, setFirstName] = useState('');
	const [showAddAccount, setShowAddAccount] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const [totalBalance, setTotalBalance] = useState(0);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { client } = useAppSelector((state) => state.client);

	const noAccounts = !accounts.length && !isLoading;

	const chartData = accountsDonutChartData(accounts);

	const openProfileChange = () => {
		setOpenProfile((prev) => !prev);
	};

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
					setTotalBalance(balanceCalculator(response, 'credit'));
					setAccounts(response);
					dispatch(loadAccounts(response));
				} else if (result && 'msg' in result && 'status' in result) {
					const { status, msg } = result;
					if (status === 401) {
						dispatch(logoutClient());
						router.push('/');
						if (typeof msg === 'string') {
							//
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
			<div className='flex flex-wrap flex-col lg:flex-row gap-10'>
				<div className='flex-1 min-w-60'>
					<div className='mb-3'>
						<p>Growing balance with us:</p>
						<CountUp
							start={0}
							end={totalBalance}
							decimals={2}
							prefix='$'
							className='text-2xl font-semibold text-bank-green'
						/>
					</div>
					<div className='w-36 h-36 mb-6'>
						<DonutChart data={chartData} />
					</div>
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
						className='mt-2 bg-bank-green px-6'
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
