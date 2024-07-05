'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MdWarningAmber } from 'react-icons/md';
import { HiHandThumbUp } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

import {
	AccountType,
	PayeeProps,
	PaymentFormProps,
	PublicClientType,
} from '@/lib/types';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
	formatCurrency,
	formValidator,
	randomString,
} from '@/lib/clientFunctions';
import PayeeItems from './PayeeItems';
import FormErrorText from '@/components/FormErrorText';
import CustomDatePicker from '@/components/CustomDatePicker';
import { Button } from '@/components/ui/button';
import { transactionAdd } from '@/appInterface/client/transaction';
import { useAppDispatch } from '@/lib/store/store';
import {
	loadAccounts,
	logoutClient,
	updateClient,
} from '@/lib/store/clientSlice';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';
import FormHeader from '@/components/FormHeader';
import CurrencyInput from '@/components/CurrencyInput';
import NoDataSpan from '@/components/NoDataSpan';
import NotificationModal from '@/components/modals/NotificationModal';

type PaymentProps = {
	client: PublicClientType;
	accounts: AccountType[];
};

type ErrorProps = {
	sourceAccountName: string;
	destinationName: string;
	amount: number | string;
};

const initialFormError = {
	sourceAccountName: '',
	destinationName: '',
	amount: '',
};

export default function MakePayment({ client, accounts }: PaymentProps) {
	const [form, setForm] = useState<PaymentFormProps>(INITIAL_PAYMENT_FORM);
	const [formError, setFormError] = useState<ErrorProps>(initialFormError);
	const [selectKey, setSelectKey] = useState('source');
	const [paymentSource, setPaymentSource] = useState<AccountType>();
	const [openNotification, setOpenNotification] = useState(false);
	const [notificationBody, setNotificationBody] = useState('');
	const [errorStatus, setErrorStatus] = useState(0);

	const { payees, _id: clientId } = client;
	const dispatch = useAppDispatch();
	const router = useRouter();

	const reset = () => {
		setForm(INITIAL_PAYMENT_FORM);
		setFormError(initialFormError);
		setSelectKey(randomString(3));
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
		className: 'sm:max-w-lg',
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

	const handleAccount = (id: string) => {
		const selectedAccount = accounts.find((a) => a._id === id);
		if (selectedAccount) {
			const { accountName: sourceAccountName } = selectedAccount;
			setPaymentSource(selectedAccount);
			setForm((prev) => ({ ...prev, sourceAccount: id, sourceAccountName }));
			setFormError(initialFormError);
		}
	};

	const handlePaymentDate = (value: Date) => {
		setForm((prev) => ({ ...prev, transactionDate: value }));
	};

	const timedError = (text: string, field: string) => {
		setFormError((prev) => ({ ...prev, [field]: text }));
		setTimeout(() => {
			setFormError(initialFormError);
		}, 4000);
	};

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setFormError(initialFormError);
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

	const handlePayee = (payee: PayeeProps) => {
		const { payeeName: destinationName, _id: destinationId } = payee;
		if (destinationId === form.destinationId) {
			setForm((prev) => ({ ...prev, destinationId: '', destinationName: '' }));
		} else setForm((prev) => ({ ...prev, destinationName, destinationId }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validatedData = formValidator(form);
		const { error, errorObject } = validatedData;
		setFormError(errorObject);
		if (error) return null;
		// Check for sufficient funds
		form.amount = Number(form.amount);
		if (paymentSource) {
			if (form.amount && form.transactionDate) {
				const { amount, transactionDate } = form;
				const insufficientFunds: boolean =
					paymentSource.accountBalance - amount < 0;
				const today = new Date().toLocaleDateString();
				const payToday = today === transactionDate.toLocaleDateString();
				if (payToday && insufficientFunds) {
					timedError(
						'Insufficient funds for this transaction.',
						'sourceAccountName'
					);
					return;
				}
				const queryData = { ...form, credit: false };
				const result = await transactionAdd(queryData);
				if (result && 'msg' in result && 'status' in result) {
					const { msg, status } = result;
					if (typeof msg === 'string' && typeof status === 'number') {
						setErrorStatus(status);
						setNotificationBody(msg);
						setOpenNotification(true);
					}
				} else if (Array.isArray(result)) {
					dispatch(loadAccounts(result));
					reset();
				}
			}
		}
	};

	useEffect(() => {
		setForm((prev) => ({ ...prev, clientId }));
	}, [clientId]);

	return (
		<div className='w-full max-w-md' suppressHydrationWarning={true}>
			<form className='pay-transfer-card' onSubmit={handleSubmit}>
				<FormHeader className='bg-black text-white p-3 sm:px-6 !pb-4'>
					<div className='flex justify-between items-center gap-5'>
						<p className='form-title-sm !mb-0'>Make Payment</p>
						<Button size={'sm'} className='px-6 bg-bank-green green-button'>
							Pay
						</Button>
					</div>
				</FormHeader>
				<div className='pay-transfer-card-content'>
					<div className=''>
						<CustomDatePicker
							className='input-effects'
							label='Payment Date'
							minDate={new Date()}
							changeFunction={handlePaymentDate}
							date={form.transactionDate}
						/>
					</div>
					<div className='my-4 text-sm font-medium'>
						<Label>Payment Source</Label>
						<Select onValueChange={handleAccount} key={selectKey}>
							<SelectTrigger
								className='w-full input-effects'
								style={{
									borderColor: formError.sourceAccountName ? 'red' : '',
								}}
							>
								<SelectValue placeholder='Payment Source' />
							</SelectTrigger>
							<SelectContent>
								{accounts.length ? (
									accounts.map(({ _id, accountName, accountBalance }) => (
										<SelectItem
											key={accountName}
											value={_id.toString()}
											className='select-item'
										>
											<span>{accountName}</span>
											<span> ${formatCurrency(accountBalance)}</span>
										</SelectItem>
									))
								) : (
									<NoDataSpan text='No payment sources.' />
								)}
							</SelectContent>
						</Select>
					</div>
					<FormErrorText
						text={formError.sourceAccountName || ''}
						className='-mt-3 mb-2'
					/>
					<CurrencyInput
						className='input-effects'
						label='Amount'
						name='amount'
						min='1'
						step={0.01}
						value={form.amount}
						placeholder=''
						changeFunction={handleAmount}
						invalid={formError.amount ? true : false}
					/>
					<FormErrorText
						text={formError.amount.toString() || ''}
						className='-mt-3 mb-2'
					/>
					<div>
						<Label>Payees</Label>
						<FormErrorText
							text={formError.destinationName || ''}
							className='mt-1 mb-2'
						/>
						<PayeeItems
							payees={payees}
							selectedId={form.destinationId}
							onSelect={handlePayee}
						/>
					</div>
				</div>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>
	);
}
