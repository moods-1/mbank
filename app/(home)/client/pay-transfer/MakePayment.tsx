'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import {
	AccountType,
	ClientNewTransactionType,
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
import { Input } from '@/components/ui/input';
import FormErrorText from '@/components/FormErrorText';
import CustomDatePicker from '@/components/CustomDatePicker';
import { Button } from '@/components/ui/button';
import { transactionAdd } from '@/api/client/transaction';
import { useAppDispatch } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';
import FormHeader from '@/components/FormHeader';
import CurrencyInput from '@/components/CurrencyInput';

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
	const { payees, _id: clientId } = client;
	const dispatch = useAppDispatch();

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
		if (paymentSource?.accountBalance && form.amount && form.transactionDate) {
			const { amount, transactionDate } = form;
			const insufficientFunds: boolean =
				paymentSource?.accountBalance - amount < 0;
			const today = new Date().getDay();
			const payToday = today === transactionDate.getDay();
			if (payToday && insufficientFunds) {
				return toast.info('Insufficient funds for this transaction.');
			}
		}
		const queryData = { ...form, credit: false };
		const result = await transactionAdd(queryData);
		if (result && 'firstName' in result) {
			dispatch(updateClient(result));
			setForm(INITIAL_PAYMENT_FORM);
			setFormError(initialFormError);
			setSelectKey(randomString(3));
		}
	};

	useEffect(() => {
		setForm((prev) => ({ ...prev, clientId }));
	}, [clientId]);

	return (
		<div className='w-full max-w-md mt-8' suppressHydrationWarning={true}>
			<form className='card border' onSubmit={handleSubmit}>
				<FormHeader className='!pb-4'>
					<div className='flex justify-between items-center gap-5'>
						<p className='form-title-sm !mb-0'>Make Payment</p>
						<Button size={'sm'} className='px-6'>
							Pay
						</Button>
					</div>
				</FormHeader>
				<div className='max-w-40'>
					<CustomDatePicker
						label='Payment Date'
						minDate={new Date()}
						changeFunction={handlePaymentDate}
						date={form.transactionDate}
					/>
				</div>
				<div className='my-4 text-sm font-medium'>
					<Label>Payment Source</Label>
					<Select onValueChange={handleAccount} key={selectKey}>
						<SelectTrigger className='w-full select-trigger'>
							<SelectValue placeholder='Payment Source' />
						</SelectTrigger>
						<SelectContent>
							{accounts.map(({ _id, accountName, accountBalance }) => (
								<SelectItem
									key={accountName}
									value={_id.toString()}
									className='select-item'
								>
									<span>{accountName}</span>
									<span> ${formatCurrency(accountBalance)}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<FormErrorText
					text={formError.sourceAccountName || ''}
					className='-mt-3 mb-2'
				/>
				<CurrencyInput
					label='Amount'
					name='amount'
					min='1'
					step={0.01}
					value={form.amount}
					placeholder=''
					changeFunction={handleAmount}
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
			</form>
			<ToastContainer
				theme='dark'
				position='bottom-left'
				containerId='MakePayment'
			/>
		</div>
	);
}
