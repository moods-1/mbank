'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Types } from 'mongoose';

import { TransactionReturnType } from '@/lib/types';
import TransactionItem from '../TransactionItem';
import DoubleSlider from '@/components/DoubleSlider';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { logoutClient } from '@/lib/store/clientSlice';
import { formatCurrency, formatDate } from '@/lib/clientFunctions';
import SearchInput from '@/components/SearchInput';
import CustomDatePicker from '@/components/CustomDatePicker';
import CurrencyInput from '@/components/CurrencyInput';
import FormErrorText from '@/components/FormErrorText';
import StaticDateRanges from './StaticDateRanges';
import PercentageDial from './PercentageDial';
import AccountHead from './AccountHead';
import { fetchTransactions } from '@/appInterface/client/transaction';
import Transactions from './Transactions';

const today = new Date();
const end = new Date(today.setHours(23, 59, 59));
const start = new Date(new Date().setDate(today.getDate() - 30));
const page = 1;
const size = 10;

const initialError = {
	startDate: '',
	endDate: '',
	minAmount: '',
	maxAmount: '',
};

export default function AccountDetails() {
	const [startDate, setStartDate] = useState<Date>(start);
	const [endDate, setEndDate] = useState<Date>(end);
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');
	const [transactions, setTransactions] = useState<TransactionReturnType[]>([]);
	const [transactionIds, setTransactionIds] = useState<Types.ObjectId[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [tableFilter, setTableFilter] = useState('');
	const [filterError, setFilterError] = useState(initialError);
	const [refetchData, setRefetchData] = useState(false);
	const [resetDateButtons, setResetDateButtons] = useState(false);
	const [customSearch, setCustomSearch] = useState(false);
	const [hideCustomSearch, setHideCustomSearch] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [totalPages, setTotalPages] = useState(0);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const { slug } = useParams();
	const id = slug[2];
	const { accounts } = useAppSelector((state) => state.client);
	const noData = !isLoading && !transactions?.length;

	const rows = transactions.map((row: TransactionReturnType) => {
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

	const logout = useCallback(() => {
		dispatch(logoutClient());
		router.push('/');
	}, [dispatch, router]);

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
		setIsLoading(true);
		setTransactions([]);
		setRefetchData((prev) => !prev);
	};

	const handleStaticDates = (start: Date, end: Date) => {
		setStartDate(start);
		setEndDate(end);
		setRefetchData((prev) => !prev);
		setCustomSearch(false);
		setTransactions([]);
	};

	const handleFilter = async (paginationNumber?: number) => {
		let min = Number(minAmount);
		let max = Number(maxAmount) || Number.MAX_SAFE_INTEGER;
		const pageNumber = paginationNumber || page;
		if (((min && !maxAmount) || min <= max) && transactionIds.length) {
			try {
				setIsLoading(true);
				setTransactions([]);
				const queryData = {
					startDate,
					endDate,
					min,
					max,
					transactions: transactionIds,
					page: pageNumber,
					size,
				};
				const result = await fetchTransactions(queryData);
				const { status } = result;
				if (status === 201 && result.response) {
					const { data, totalPages, hasMore } = result.response;
					setTotalPages(totalPages);
					setHasMore(hasMore);
					setTransactions(data);
				} else if (status === 401) {
					logout();
				}
			} catch (error) {}
			setIsLoading(false);
		} else if (min > max) {
			return timedError(
				'Upper limit must be greater than or equal to the lower!',
				'maxAmount'
			);
		}
		if (endDate < startDate) {
			return timedError('End date must greater than start date!', 'endDate');
		}
	};

	useEffect(() => {
		const account = accounts.find((a) => a._id === id);
		const getTransactions = async (transIds: Types.ObjectId[]) => {
			const startDate = start;
			const endDate = end;
			setIsLoading(true);
			try {
				const queryData = {
					startDate,
					endDate,
					min: 0,
					max: Number.MAX_SAFE_INTEGER,
					transactions: transIds,
					page,
					size,
				};
				const result = await fetchTransactions(queryData);
				const { status } = result;
				if (status === 201 && result.response) {
					const { data, totalPages, hasMore } = result.response;
					setTotalPages(totalPages);
					setHasMore(hasMore);
					setTransactions(data);
				} else if (status === 401) {
					logout();
				}
			} catch (error) {}
			setIsLoading(false);
			setTransactionIds(transIds);
		};
		account && getTransactions(account.transactions);
	}, [id, refetchData, logout, accounts]);

	const formattedDates = () => {
		const formattedStart = formatDate(startDate, 'MMM DD, YYYY');
		const formattedEnd = formatDate(endDate, 'MMM DD, YYYY');
		return `${formattedStart} to ${formattedEnd}`;
	};

	return (
		<div className='pb-10 flex flex-col-reverse lg:flex-row gap-6'>
			<div className='flex-1 max-w-4xl'>
				<div>
					<AccountHead id={id} />
					<div className='mt-6 '>
						<p className='font-medium mb-1 text-sm xs:text-base flex flex-wrap gap-x-1'>
							<span>{`Past Transactions `}</span>
							<span>{`(${formattedDates()})`}</span>
						</p>
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
												className='input-effects'
												id='minAmount'
												name='minAmount'
												label='Lower Limit'
												min='0'
												step={1}
												value={minAmount}
												placeholder=''
												changeFunction={handleChange}
												invalid={filterError.minAmount ? true : false}
											/>
											<FormErrorText
												text={filterError.minAmount}
												className='-mt-4 mb-2'
											/>
										</div>
										<div className='max-w-52 w-full'>
											<CurrencyInput
												className='input-effects'
												id='maxAmount'
												name='maxAmount'
												label='Upper Limit'
												min={minAmount}
												step={1}
												value={maxAmount}
												placeholder=''
												changeFunction={handleChange}
												invalid={filterError.maxAmount ? true : false}
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
								<Transactions
									rows={rows}
									isLoading={isLoading}
									loaderRows={7}
									dataFilter={tableFilter}
									hasMore={hasMore}
									totalPages={totalPages}
									handlePage={handleFilter}
									reset={refetchData}
								/>
								<div className='block sm:hidden max-w-2xl border min-h-[410px] overflow-y-auto'>
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
			<PercentageDial id={id} />
		</div>
	);
}
