'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { AccountType, TransactionReturnType } from '@/lib/types';
import TransactionItem from '../TransactionItem';
import { SlideLoader } from '@/components/Loaders';
import DoubleSlider from '@/components/DoubleSlider';
import { getAccDetails } from '@/api/client/accounts';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import { logoutClient } from '@/lib/store/clientSlice';
import CustomDataTable from '@/components/CustomDataTable';
import { TRANSACTION_HEADERS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/clientFunctions';
import SearchInput from '@/components/SearchInput';
import CustomDatePicker from '@/components/CustomDatePicker';
import CurrencyInput from '@/components/CurrencyInput';
import FormErrorText from '@/components/FormErrorText';
import StaticDateRanges from './StaticDateRanges';

const today = new Date();
const end = new Date(today.setHours(23, 59, 59));
const start = new Date(new Date().setDate(today.getDate() - 30));

const initialError = {
	startDate: '',
	endDate: '',
	minAmount: '',
	maxAmount: '',
};

export default function AccountDetails() {
	const [account, setAccount] = useState<AccountType>();
	const [startDate, setStartDate] = useState<Date>(start);
	const [endDate, setEndDate] = useState<Date>(end);
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');
	const [transactions, setTransactions] = useState<TransactionReturnType[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [tableFilter, setTableFilter] = useState('');
	const [filterError, setFilterError] = useState(initialError);
	const [refetchData, setRefetchData] = useState(false);
	const [resetDateButtons, setResetDateButtons] = useState(false);
	const [customSearch, setCustomSearch] = useState(false);
	const [hideCustomSearch, setHideCustomSearch] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { slug } = useParams();
	const id = slug[2];
	const noData = !isLoading && !transactions?.length;

	const rows = transactions?.map((row: TransactionReturnType) => {
		const { transactionDate, amount, credit, accountBalance } = row;
		const formattedAmount = formatCurrency(amount);
		const formattedBalance = formatCurrency(accountBalance);
		return {
			...row,
			date: formatDate(transactionDate, 'DD-MMM-YYYY'),
			credit: credit ? formattedAmount : '',
			debit: credit ? '' : formattedAmount,
			accountBalance: formattedBalance,
		};
	});

	const emptyMessage = () => {
		return (
			<div className='caption-message text-center'>
				<p> No transactions.</p>
			</div>
		);
	};

	const timedError = (text: string, field: string) => {
		setFilterError((prev) => ({ ...prev, [field]: text }));
		setTimeout(() => {
			setFilterError(initialError);
		}, 4000);
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
		setRefetchData((prev) => !prev);
	};

	const handleStaticDates = (start: Date, end: Date) => {
		setStartDate(start);
		setEndDate(end);
		setRefetchData((prev) => !prev);
		setCustomSearch(false);
		setTransactions([]);
	};

	const handleFilter = async () => {
		const min = Number(minAmount);
		const max = Number(maxAmount);
		if (min > max) {
			return timedError(
				'Upper limit must be greater than or equal to the lower!',
				'maxAmount'
			);
		}
		if (endDate < startDate) {
			return timedError('End date must greater than start date!', 'endDate');
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
					}
				}
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};
		fetchAccount();
	}, [dispatch, id, router, refetchData]);

	const balance = account?.accountBalance.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});

	const formattedDates = () => {
		const formattedStart = formatDate(startDate, 'MMM DD, YYYY');
		const formattedEnd = formatDate(endDate, 'MMM DD, YYYY');
		return `${formattedStart} to ${formattedEnd}`;
	};

	return (
		<div className='pb-10 flex gap-6'>
			<div className='flex-1 max-w-4xl'>
				<div>
					<p className='text-lg sm:text-xl font-semibold'>
						{account?.accountName || <SlideLoader className='h-6 max-w-96' />}
					</p>
					<p className='text-sm'>
						<span className='font-semibold'>Account number:</span>{' '}
						<span className='font-medium'>{id}</span>
					</p>
					<p className='flex text-sm'>
						<span className='font-semibold'>Balance: </span>
						{balance ? (
							<span className='font-medium'>{`$ ${balance}`}</span>
						) : (
							<SlideLoader className='h-6 max-w-40' />
						)}
					</p>
					<div className='mt-6 '>
						<p className='font-medium mb-1 text-sm xs:text-base'>{`Past Transactions (${formattedDates()})`}</p>
						<div className='border p-4 pb-0 border-t-4 border-t-black'>
							<div className='flex justify-between items-start flex-wrap gap-5'>
								<div
									className='py-1 cursor-pointer text-xs min-w-28 text-center font-semibold hover:text-bank-green'
									onClick={() => setHideCustomSearch((prev) => !prev)}
								>
									{hideCustomSearch ? 'Show' : 'Hide'} Custom Search
								</div>
								<StaticDateRanges
									handleButtons={handleStaticDates}
									reset={resetDateButtons}
									customSearch={customSearch}
								/>
							</div>
							{hideCustomSearch ? null : (
								<div className='py-4 border-t'>
									<p className='font-medium mb-2'>Transaction Custom Search</p>
									<div className='account-filter-box'>
										<div>
											<CustomDatePicker
												label='Start Date'
												date={startDate}
												maxDate={endDate}
												changeFunction={setStartDate}
											/>
											<FormErrorText text={filterError.startDate} />
										</div>
										<div>
											<CustomDatePicker
												label='End Date'
												date={endDate}
												minDate={startDate}
												changeFunction={setEndDate}
											/>
											<FormErrorText text={filterError.endDate} />
										</div>
									</div>
									<div className='account-filter-box'>
										<div className='w-full max-w-52'>
											<CurrencyInput
												id='minAmount'
												name='minAmount'
												label='Lower Limit'
												min='0'
												step={1}
												value={minAmount}
												placeholder=''
												changeFunction={handleChange}
											/>
											<FormErrorText
												text={filterError.minAmount}
												className='-mt-4 mb-2'
											/>
										</div>
										<div className='max-w-52 w-full'>
											<CurrencyInput
												id='maxAmount'
												name='maxAmount'
												label='Upper Limit'
												min={minAmount}
												step={1}
												value={maxAmount}
												placeholder=''
												changeFunction={handleChange}
											/>
											<FormErrorText
												text={filterError.maxAmount}
												className='-mt-4 mb-2'
											/>
										</div>
									</div>
									<div className='flex gap-5 -mt-3'>
										<Button
											className='bg-bank-green px-4 h-7'
											size={'sm'}
											onClick={() => {
												handleFilter();
												setCustomSearch(true);
											}}
											type='submit'
										>
											Search
										</Button>
										<Button
											className='bg-black px-4 h-7'
											size={'sm'}
											onClick={() => {
												resetFilter();
												setResetDateButtons((prev) => !prev);
											}}
										>
											Reset
										</Button>
									</div>
								</div>
							)}
						</div>
						<div className='mb-10 border'>
							<div className='flex items-center justify-between mb-4 w-full pt-5 px-4'>
								<p className='font-semibold'>Transaction List</p>
								<div className='hidden sm:block'>
									<SearchInput
										placeholder='Search entity'
										className='max-w-60'
										changeFunction={(value: string) => setTableFilter(value)}
									/>
								</div>
							</div>
							<>
								<div className='hidden sm:block w-full max-h-[70vh] pt-0'>
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
									{noData
										? emptyMessage()
										: transactions?.map((transaction, idx) => (
												<TransactionItem key={idx} transaction={transaction} />
										  ))}
								</div>
							</>
						</div>
					</div>
				</div>
			</div>
			<div className='flex-1 max-w-xl bg-red-500 hidden xl:block' />
		</div>
	);
}
