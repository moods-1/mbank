'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

import { useAppSelector, useAppDispatch } from '@/lib/store/store';
import { AccountType, PaymentFormProps } from '@/lib/types';
import { getAccounts } from '@/api/client/accounts';
import { logoutClient } from '@/lib/store/clientSlice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { firstCap, formatCurrency } from '@/lib/clientFunctions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';

type ErrorType = {
	destinationName: string;
	amount: number | string;
	sourceAccountName: string;
};

// const initialTransfer: TransferType = {
// 	from: '',
// 	to: '',
// 	amount: '',
// };

const initialError = {
	destinationName: '',
	amount: '',
	sourceAccountName: '',
};

export default function QuickTransfer() {
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [form, setForm] = useState<PaymentFormProps>(INITIAL_PAYMENT_FORM);
	const [formError, setFormErrorText] = useState<ErrorType>(initialError);
	const [isLoading, setIsLoading] = useState(true);
	const { client } = useAppSelector((state) => state.client);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleAccount = (e: string, field: string) => {
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
		setFormErrorText(initialError);
	};

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		// setFormErrorText(initialTransfer);
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

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { sourceAccount, amount } = form;
		let localErrObj: ErrorType = { ...initialError };
		let errMsg: string = '';
		const errorSet = new Set();
		// Make sure all fields are filled.
		Object.entries(form).forEach(([key, value]) => {
			if (!value || Number(value) <= 1) {
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
		setFormErrorText(localErrObj);
		if (errorSet.has(true)) return;
		// Check for sufficient funds
		const fromBalance = accounts.find(
			(a) => a._id === sourceAccount
		)?.accountBalance;
		if (fromBalance && fromBalance - Number(amount) < 0) {
			return toast.info(
				'There are insufficient funds to complete this transfer.'
			);
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
		<div className=''>
			<form className='card border max-w-72' onSubmit={handleSubmit}>
				<p className='form-title-sm'>Quick Transfer</p>
				<div className='mb-4 text-sm font-medium'>
					<Label>From</Label>
					<Select
						onValueChange={(e: string) => handleAccount(e, 'from')}
						name='from'
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Account' />
						</SelectTrigger>
						<SelectContent>
							{accounts.map(({ _id, accountName, accountBalance }) => (
								<SelectItem
									key={accountName}
									disabled={_id.toString() === form.destinationId}
									value={`${_id},${accountName}`}
									className='select-item'
								>
									<span>{accountName}</span>
									<span> ${formatCurrency(accountBalance)}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormErrorText text={formError.sourceAccountName} className='-mb-2' />
				</div>
				<div className='mb-4 text-sm font-medium'>
					<Label>To</Label>
					<Select
						onValueChange={(e: string) => handleAccount(e, 'to')}
						name='to'
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Account' />
						</SelectTrigger>
						<SelectContent>
							{accounts.map(({ _id, accountName, accountBalance }) => (
								<SelectItem
									key={accountName}
									disabled={_id.toString() === form.sourceAccount}
									value={`${_id},${accountName}`}
									className='select-item'
								>
									<span>{accountName}</span>
									<span> ${formatCurrency(accountBalance)}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormErrorText text={formError.destinationName} className='-mb-2' />
				</div>
				<div className='w-full number-input-div'>
					<label htmlFor='transferAmount'>Amount</label>
					<div className='input-box'>
						<span className='left-span'>$</span>
						<span className='right-span bg-white h-6 w-6' />
						<Input
							id='transferAmount'
							name='amount'
							type='number'
							min='1'
							step='0.01'
							value={form.amount}
							placeholder=''
							onChange={handleAmount}
						/>
					</div>
					<FormErrorText text={formError.amount.toString()} className='-mb-2' />
				</div>
				<Button className='w-full mt-2'>Transfer</Button>
			</form>
			<ToastContainer theme='dark' position='bottom-left' />
		</div>
	);
}
