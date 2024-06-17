'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/lib/store/store';
import { AccountType, PaymentFormProps } from '@/lib/types';
import { getAccounts, transferQuick } from '@/api/client/accounts';
import { logoutClient, updateClient } from '@/lib/store/clientSlice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { firstCap, formatCurrency, randomString } from '@/lib/clientFunctions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import CurrencyInput from '@/components/CurrencyInput';
import NoDataSpan from '@/components/NoDataSpan';

type ErrorType = {
	destinationName: string;
	amount: number | string;
	sourceAccountName: string;
};

const initialError = {
	destinationName: '',
	amount: '',
	sourceAccountName: '',
};

export default function QuickTransfer() {
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [form, setForm] = useState<PaymentFormProps>(INITIAL_PAYMENT_FORM);
	const [formError, setFormError] = useState<ErrorType>(initialError);
	const [isLoading, setIsLoading] = useState(true);
	const [selectKeys, setSelectKeys] = useState({ from: 'from', to: 'to' });
	const { client } = useAppSelector((state) => state.client);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleAccount = (e: string, field: string) => {
		console.log('In handle account');
		setFormError(initialError);
		const [id, accountName] = e.split(',');
		if (field === 'from') {
			setForm((prev) => ({
				...prev,
				sourceAccount: id,
				sourceAccountName: accountName,
			}));
		} else {
			setForm((prev) => ({
				...prev,
				destinationId: id,
				destinationName: accountName,
			}));
		}
		setFormError(initialError);
	};

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setFormError(initialError);
		const { value } = e.target;
		let localValue = value;
		localValue = value.replace('-', '');
		// Limit the value to 2 decimal places
		if (localValue.includes('.')) {
			const [start, end] = localValue.split('.');
			if (end.length >= 2) {
				localValue = start + '.' + end.slice(0, 2);
			}
		}
		setForm((prev) => ({ ...prev, amount: localValue }));
	};

	const handleInsufficientFunds = () => {
		setFormError((prev) => ({
			...prev,
			sourceAccountName:
				'There are insufficient funds to complete this transfer.',
		}));
		setTimeout(() => { setFormError(initialError) }, 4000);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { sourceAccount, amount } = form;
		let localErrObj: ErrorType = { ...initialError };
		let errMsg: string = '';
		const errorSet = new Set();
		// Form validation.
		Object.entries(form).forEach(([key, value]) => {
			if (!value || Number(value) < 1) {
				errorSet.add(true);
				if (key === 'amount') {
					errMsg = `${firstCap(key)} is required.`;
				} else if (key === 'sourceAccountName') {
					errMsg = 'The source account is required.';
				} else if (key === 'destinationName') {
					errMsg = 'The destination account is required.';
				}
				localErrObj[key as keyof typeof localErrObj] = errMsg;
			}
		});
		setFormError(localErrObj);
		if (errorSet.has(true)) return;

		// Check for sufficient funds
		const fromBalance = accounts.find(
			(a) => a._id === sourceAccount
		)?.accountBalance;
		
		if (fromBalance) {
			// Check for sufficient funds
			if (fromBalance - Number(amount) < 0) {
				handleInsufficientFunds();
				return;
			} else {
				const queryData = {
					...form,
					amount: Number(form.amount),
					credit: false,
				};
				const result = await transferQuick(queryData);
				if (result && 'firstName' in result) {
					dispatch(updateClient(result));
					setForm(INITIAL_PAYMENT_FORM);
					setFormError(initialError);
					setSelectKeys({ from: randomString(4), to: randomString(4) });
				}
			}
		} else {
			handleInsufficientFunds();
			return;
		}
	};

	useEffect(() => {
		const fetchAccounts = async () => {
			setIsLoading(true);
			try {
				const { accounts } = client;
				const result = await getAccounts(accounts);
				if (result && 'response' in result) {
					const { response } = result;
					setAccounts(response);
				} else if (result && 'msg' in result && 'status' in result) {
					const { status, msg } = result;
					if (status === 401) {
						dispatch(logoutClient());
						router.push('/');
						if (typeof msg === 'string') {
							// return toast.error(msg);
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
			setForm((prev) => ({ ...prev, clientId: client._id }));
		};
		fetchAccounts();
	}, [client, dispatch, router]);

	return (
		<div className=''>
			<form className='card border max-w-72' onSubmit={handleSubmit}>
				<FormHeader>
					<p className='form-title-sm'>Quick Transfer</p>
					<p className='text-sm'>Transfer between your accounts</p>
				</FormHeader>
				<div className='mb-4 text-sm font-medium'>
					<Label>From</Label>
					<Select
						onValueChange={(e: string) => handleAccount(e, 'from')}
						defaultValue={form.destinationName}
						key={selectKeys.from}
						name='from'
					>
						<SelectTrigger className='w-full no-focus focus:border-gray-400'>
							<SelectValue placeholder='Account' />
						</SelectTrigger>
						<SelectContent>
							{accounts.length ? (
								accounts.map(({ _id, accountName, accountBalance }) => (
									<SelectItem
										key={accountName}
										disabled={_id.toString() === form.destinationId}
										value={`${_id},${accountName}`}
										className='select-item'
									>
										<span>{accountName}</span>
										<span> ${formatCurrency(accountBalance)}</span>
									</SelectItem>
								))
							) : (
								<NoDataSpan text='No accounts.' />
							)}
						</SelectContent>
					</Select>
					<FormErrorText text={formError.sourceAccountName} className='-mb-2' />
				</div>
				<div className='mb-4 text-sm font-medium'>
					<Label>To</Label>
					<Select
						onValueChange={(e: string) => handleAccount(e, 'to')}
						key={selectKeys.to}
						name='to'
					>
						<SelectTrigger className='w-full no-focus focus:border-gray-400'>
							<SelectValue placeholder='Account' />
						</SelectTrigger>
						<SelectContent>
							{accounts.length ? (
								accounts.map(({ _id, accountName, accountBalance }) => (
									<SelectItem
										key={accountName}
										disabled={_id.toString() === form.sourceAccount}
										value={`${_id},${accountName}`}
										className='select-item'
									>
										<span>{accountName}</span>
										<span> ${formatCurrency(accountBalance)}</span>
									</SelectItem>
								))
							) : (
								<NoDataSpan text='No accounts.' />
							)}
						</SelectContent>
					</Select>
					<FormErrorText text={formError.destinationName} className='-mb-2' />
				</div>
				<div className='w-full'>
					<CurrencyInput
						label='Amount'
						id='transferAmount'
						name='amount'
						min='1'
						step={0.01}
						value={form.amount}
						placeholder=''
						changeFunction={handleAmount}
					/>
					<FormErrorText text={formError.amount.toString()} className='-mt-4' />
				</div>
				<Button className='w-full mt-2'>Transfer</Button>
			</form>
		</div>
	);
}
