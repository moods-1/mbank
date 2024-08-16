'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdWarningAmber } from 'react-icons/md';
import { HiHandThumbUp } from 'react-icons/hi2';

import { useAppSelector, useAppDispatch } from '@/lib/store/store';
import { PaymentFormProps } from '@/lib/types';
import { transferQuick } from '@/appInterface/client/accounts';
import { loadAccounts, logoutClient } from '@/lib/store/clientSlice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { firstCap, formatCurrency, randomString } from '@/lib/clientFunctions';

import { Label } from '@/components/ui/label';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import CurrencyInput from '@/components/CurrencyInput';
import NoDataSpan from '@/components/NoDataSpan';
import NotificationModal from '@/components/modals/NotificationModal';
import HoverButton from '@/components/HoverButton';

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
	const [form, setForm] = useState<PaymentFormProps>(INITIAL_PAYMENT_FORM);
	const [formError, setFormError] = useState<ErrorType>(initialError);
	const [isLoading, setIsLoading] = useState(true);
	const [selectKeys, setSelectKeys] = useState({ from: 'from', to: 'to' });
	const [openNotification, setOpenNotification] = useState(false);
	const [notificationBody, setNotificationBody] = useState('');
	const [errorStatus, setErrorStatus] = useState(0);
	const { client, accounts } = useAppSelector((state) => state.client);

	const { _id: clientId } = client;
	const router = useRouter();
	const dispatch = useAppDispatch();

	const reset = () => {
		setForm(INITIAL_PAYMENT_FORM);
		setFormError(initialError);
		setSelectKeys({ from: randomString(4), to: randomString(4) });
		setErrorStatus(0);
	};

	const handleNotification = () => {
		if (errorStatus === 401) {
			dispatch(logoutClient());
			router.push('/');
		} else {
			reset();
			setOpenNotification((prev) => !prev);
		}
	};

	const responseError = errorStatus >= 400;
	const notificationProps = {
		title: responseError ? 'Warning!' : 'Success',
		body: notificationBody,
		buttonText: 'Close',
		buttonFunction: handleNotification,
		buttonClass: '',
		className: 'sm:max-w-sm',
		open: openNotification,
		openChange: handleNotification,
		icon: (
			<div
				className={`w-14 h-14 rounded-full ${
					responseError ? 'bg-red-600' : 'bg-bank-green'
				} flex-center-row mx-auto text-white`}
			>
				{responseError ? (
					<MdWarningAmber className='text-3xl' />
				) : (
					<HiHandThumbUp className='text-4xl' />
				)}
			</div>
		),
	};

	const handleAccount = (e: string, field: string) => {
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
		setTimeout(() => {
			setFormError(initialError);
		}, 4000);
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
				if (result) {
					if ('response' in result) {
						dispatch(loadAccounts(result.response));
					}
					if ('msg' in result && 'status' in result) {
						const { msg, status } = result;
						if (typeof msg === 'string' && typeof status === 'number') {
							setErrorStatus(status);
							setNotificationBody(msg);
						}
					}
				} else {
					const msg = 'Sorry, we could not process the transaction.';
					setErrorStatus(500);
					setNotificationBody(msg);
				}
				setOpenNotification(true);
			}
		} else {
			handleInsufficientFunds();
			return;
		}
	};

	useEffect(() => {
		setIsLoading(true);
		setForm((prev) => ({ ...prev, clientId }));
		setIsLoading(false);
	}, [accounts, clientId]);

	const noData = !accounts.length && !isLoading;

	return (
		<div className=''>
			<form className='pay-transfer-card max-w-72' onSubmit={handleSubmit}>
				<FormHeader className='bg-black text-white p-3 sm:px-6'>
					<p className='form-title-sm flex items-center'>Quick Transfer</p>
					<p className='text-sm'>Transfer between your accounts</p>
				</FormHeader>
				<div className='pay-transfer-card-content'>
					<div className='mb-4 text-sm font-medium'>
						<Label>From</Label>
						<Select
							onValueChange={(e: string) => handleAccount(e, 'from')}
							defaultValue={form.destinationName}
							key={selectKeys.from}
							name='from'
						>
							<SelectTrigger
								className='w-full no-focus input-effects'
								style={{ borderColor: formError.destinationName ? 'red' : '' }}
							>
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
						<FormErrorText
							text={formError.sourceAccountName}
							className='-mb-2'
						/>
					</div>
					<div className='mb-4 text-sm font-medium'>
						<Label>To</Label>
						<Select
							onValueChange={(e: string) => handleAccount(e, 'to')}
							key={selectKeys.to}
							name='to'
						>
							<SelectTrigger
								className='w-full no-focus input-effects'
								style={{ borderColor: formError.destinationName ? 'red' : '' }}
							>
								<SelectValue placeholder='Account' />
							</SelectTrigger>
							<SelectContent>
								{noData ? (
									<NoDataSpan text='No accounts.' />
								) : (
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
								)}
							</SelectContent>
						</Select>
						<FormErrorText text={formError.destinationName} className='-mb-2' />
					</div>
					<div className='w-full'>
						<CurrencyInput
							className='input-effects'
							label='Amount'
							id='transferAmount'
							name='amount'
							min='1'
							step={0.01}
							value={form.amount}
							placeholder=''
							invalid={formError.amount ? true : false}
							changeFunction={handleAmount}
						/>
						<FormErrorText
							text={formError.amount.toString()}
							className='-mt-4'
						/>
					</div>
					<HoverButton className='h-10 mt-2' title='Transfer' />
				</div>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>
	);
}
