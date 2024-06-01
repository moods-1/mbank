'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

import { AccountType, TransactionType } from '@/lib/types';
import TransactionItem from '../TransactionItem';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import { SlideLoader } from '@/components/Loaders';
import DoubleSlider from '@/components/DoubleSlider';
import { getAccDetails } from '@/api/client/accounts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import { logoutClient } from '@/lib/store/clientSlice';

const today = new Date();
const end = new Date(today.setHours(23, 59, 59));
const start = new Date(new Date().setDate(today.getDate() - 30));

export default function AccountDetails() {
	const [account, setAccount] = useState<AccountType>();
	const [startDate, setStartDate] = useState<Date>(start);
	const [endDate, setEndDate] = useState<Date>(end);
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');
	const [transactions, setTransactions] = useState<TransactionType[]>();
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { slug } = useParams();
	const id = slug[2];
	const noTransactions = !transactions?.length && !isLoading;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = e;
		const { name, value } = target;
		if (name === 'minAmount') {
			setMinAmount(value);
		} else {
			setMaxAmount(value);
		}
	};

	const handleFilter = async () => {
		const min = Number(minAmount);
		const max = Number(maxAmount);
		if (min > max) {
			return toast.info(
				'Upper limit must be greater than or equal to the lower!'
			);
		}
		if (endDate < startDate) {
			return toast.info('End date must greater than start date!');
		}
		try {
			setIsLoading(true);
			const queryData = {
				id,
				filter: { startDate, endDate, minAmount: min, maxAmount: max },
			};
			const result = await getAccDetails(queryData);
			if (result && 'account' in result) {
				const { account, transactions } = result;
				setAccount(account);
				setTransactions(transactions);
			} else if (result && 'msg' in result) {
				const { status, msg } = result;
				if (status === 401) {
					dispatch(logoutClient());
					router.push('/');
					return toast.error(msg);
				}
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		const fetchAccount = async () => {
			const startDate = start;
			const endDate = end;
			const minAmount = 0;
			const maxAmount = Number.MAX_SAFE_INTEGER;
			try {
				const queryData = {
					id,
					filter: { startDate, endDate, minAmount, maxAmount },
				};
				const result = await getAccDetails(queryData);
				if (result?.account && result?.transactions) {
					const { account, transactions } = result;
					setAccount(account);
					setTransactions(transactions);
				} else if (result && 'msg' in result) {
					const { status, msg } = result;
					if (status === 401) {
						dispatch(logoutClient());
						router.push('/');
						return toast.error(msg);
					}
				}
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};
		fetchAccount();
	}, [dispatch, id, router]);

	const balance = account?.accountBalance.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});

	return (
		<div className='pb-10'>
			<div>
				<p className='text-lg sm:text-xl font-semibold'>
					{account?.accountName || <SlideLoader className='h-6 max-w-96' />}
				</p>
				<p>
					<span className='font-semibold'>Account number:</span> {id}
				</p>
				<p className='flex'>
					<span className='font-semibold'>Balance: </span>
					{balance ? `$ ${balance}` : <SlideLoader className='h-6 max-w-40' />}
				</p>
				<div className='mt-6'>
					<p className='font-medium mb-2'>Transaction Custom Search</p>
					<div className='filter-box'>
						<DatePickerDemo
							label='Start Date'
							type='start'
							comparisonDate={endDate}
							date={startDate}
							changeFunction={setStartDate}
							className='mr-2'
						/>
						<DatePickerDemo
							label='End Date'
							type='end'
							comparisonDate={startDate}
							date={endDate}
							changeFunction={setEndDate}
						/>
					</div>
					<div className='filter-box'>
						<div className='mr-2 w-full max-w-56'>
							<label htmlFor='minAmount'>Lower $ limit</label>
							<div className='input-box'>
								<span>$</span>
								<Input
									type='number'
									id='minAmount'
									name='minAmount'
									min='0'
									step={1}
									value={minAmount}
									placeholder=''
									onChange={handleChange}
								/>
							</div>
						</div>
						<div className='max-w-56 w-full'>
							<label htmlFor='maxAmount'>Upper $ limit</label>
							<div className='input-box'>
								<span>$</span>
								<Input
									type='number'
									id='maxAmount'
									name='maxAmount'
									min={minAmount}
									step={1}
									value={maxAmount}
									placeholder=''
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
					<Button
						className='bg-bank-green px-4'
						size={'sm'}
						onClick={handleFilter}
					>
						Search
					</Button>
				</div>
			</div>
			<div>
				<div className='mt-6'>
					<p className='font-semibold mb-4'>Transactions</p>
					<>
						{noTransactions ? (
							<div>No transactions</div>
						) : (
							<div className='max-w-2xl border'>
								{isLoading ? <DoubleSlider /> : null}
								{transactions?.map((transaction, idx) => (
									<TransactionItem key={idx} transaction={transaction} />
								))}
							</div>
						)}
					</>
					<div></div>
				</div>
			</div>
			<ToastContainer theme='dark' position='bottom-left' />
		</div>
	);
}
