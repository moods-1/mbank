'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

import { AccountType, TransactionReturnType } from '@/lib/types';
import TransactionItem from '../TransactionItem';
import { DatePicker } from '@/components/ui/DatePicker';
import { SlideLoader } from '@/components/Loaders';
import DoubleSlider from '@/components/DoubleSlider';
import { getAccDetails } from '@/api/client/accounts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import { logoutClient } from '@/lib/store/clientSlice';
import moment from 'moment';
import CustomDataTable from '@/components/CustomDataTable';
import { TRANSACTION_HEADERS } from '@/lib/constants';
import { formatCurrency } from '@/lib/clientFunctions';
import SearchInput from '@/components/SearchInput';
import CustomDatePicker from '@/components/CustomDatePicker';
import { Label } from '@/components/ui/label';
import CurrencyInput from '@/components/CurrencyInput';

const today = new Date();
const end = new Date(today.setHours(23, 59, 59));
const start = new Date(new Date().setDate(today.getDate() - 30));

export default function AccountDetails() {
	const [account, setAccount] = useState<AccountType>();
	const [startDate, setStartDate] = useState<Date>(start);
	const [endDate, setEndDate] = useState<Date>(end);
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');
	const [transactions, setTransactions] = useState<TransactionReturnType[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [tableFilter, setTableFilter] = useState('');
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { slug } = useParams();
	const id = slug[2];

	const rows = transactions?.map((row: TransactionReturnType) => {
		const { transactionDate, amount, credit, accountBalance } = row;
		const formattedAmount = formatCurrency(amount);
		const formattedBalance = formatCurrency(accountBalance);
		return {
			...row,
			date: moment(transactionDate).format('DD-MMM-YYYY'),
			credit: credit ? formattedAmount : '',
			debit: credit ? '' : formattedAmount,
			accountBalance: formattedBalance,
		};
	});

	const emptyMessage = () => {
		return (
			<div className='caption-message'>
				<p> No transactions.</p>
			</div>
		);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = e;
		const { name, value } = target;
		let localValue: string = value.replace(/[^0-9]/g, '');
		if (name === 'minAmount') {
			setMinAmount(localValue);
		} else {
			setMaxAmount(localValue);
		}
	};

	const resetFilter = () => {
		setStartDate(start);
		setEndDate(end);
		setMinAmount('');
		setMaxAmount('');
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
		<div className='pb-10 flex gap-6'>
			<div className='flex-1'>
				<div>
					<p className='text-lg sm:text-xl font-semibold'>
						{account?.accountName || <SlideLoader className='h-6 max-w-96' />}
					</p>
					<p className='text-[15px]'>
						<span className='font-semibold'>Account number:</span> {id}
					</p>
					<p className='flex text-[15px]'>
						<span className='font-semibold'>Balance: </span>
						{balance ? (
							`$ ${balance}`
						) : (
							<SlideLoader className='h-6 max-w-40' />
						)}
					</p>
					<div className='mt-6'>
						<p className='font-medium mb-2'>Transaction Custom Search</p>
						<div className='account-filter-box-date'>
							<CustomDatePicker
								label='Start Date'
								date={startDate}
								maxDate={endDate}
								changeFunction={setStartDate}
							/>
							<CustomDatePicker
								label='End Date'
								date={endDate}
								minDate={startDate}
								changeFunction={setEndDate}
							/>
						</div>
						<div className='account-filter-box'>
							<div className='w-full max-w-52'>
								<CurrencyInput
									id='minAmount'
									name='minAmount'
									label='Lower $ limit'
									min='0'
									step={1}
									value={minAmount}
									placeholder=''
									changeFunction={handleChange}
								/>
							</div>
							<div className='max-w-52 w-full'>
								<CurrencyInput
									id='maxAmount'
									name='maxAmount'
									label='Upper $ limit'
									min={minAmount}
									step={1}
									value={maxAmount}
									placeholder=''
									changeFunction={handleChange}
								/>
							</div>
						</div>
						<div className='flex gap-5'>
							<Button
								className='bg-bank-green px-4'
								size={'sm'}
								onClick={handleFilter}
								type='submit'
							>
								Search
							</Button>
							<Button
								className='bg-black px-4'
								size={'sm'}
								onClick={resetFilter}
							>
								Reset
							</Button>
						</div>
					</div>
				</div>
				<div>
					<div className='mt-6 mb-10'>
						<div className='flex items-center justify-between mb-4 max-w-2xl'>
							<p className='font-semibold'>Transactions</p>
							<SearchInput
								placeholder='Search entity'
								className='max-w-60'
								changeFunction={(value: string) => setTableFilter(value)}
							/>
						</div>
						<>
							<div className='hidden sm:block max-w-2xl border rounded-sm max-h-[70vh] pt-0'>
								<CustomDataTable
									rows={rows}
									isLoading={isLoading}
									columns={TRANSACTION_HEADERS}
									tableHeight={400}
									emptyMessage={emptyMessage()}
									dataFilter={tableFilter}
									filterable
								/>
							</div>
							<div className='block sm:hidden max-w-2xl border max-h-[70vh] overflow-y-auto'>
								{isLoading ? <DoubleSlider /> : null}
								{transactions?.map((transaction, idx) => (
									<TransactionItem key={idx} transaction={transaction} />
								))}
							</div>
						</>
					</div>
				</div>
			</div>
			<div className='flex-1 bg-red-500 hidden lg:block' />
			<ToastContainer
				theme='dark'
				position='bottom-left'
				containerId='AccountDetails'
			/>
		</div>
	);
}
