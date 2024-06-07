'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Types } from 'mongoose';
import { ToastContainer, toast } from 'react-toastify';

import {
	AccountType,
	PayeeProps,
	PayeeType,
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
import { formatCurrency, formValidator } from '@/lib/clientFunctions';
import PayeeItems from './PayeeItems';
import { Input } from '@/components/ui/input';
import FormErrorText from '@/components/FormErrorText';
import Calendar from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { transactionAdd } from '@/api/client/transaction';
import { useAppDispatch } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import { INITIAL_PAYMENT_FORM } from '@/lib/constants';

type PaymentProps = {
	client: PublicClientType;
	accounts: AccountType[];
};

type ErrorProps = {
	sourceAccountName: string,
	destinationName: string,
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
	const [transactionDate, setPaymentDate] = useState<Date>(
		new Date(new Date().setHours(0, 0, 1))
	);
	const [paymentSource, setPaymentSource] = useState<AccountType>();
	const [paymentDestination, setPaymentDestination] = useState<PayeeProps>();
	const [clientSide, setClientSide] = useState(false);
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
		setForm((prev) => ({ ...prev, destinationName, destinationId }));
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
		}
	};

	useEffect(() => {
		setForm((prev) => ({ ...prev, clientId }));
		setClientSide(true);
	}, [clientId]);

	return (
		<div className='w-full max-w-md mt-8'>
			<form className='card border' onSubmit={handleSubmit}>
				<div className='flex justify-between items-center gap-5 mb-4'>
					<p className='form-title-sm !mb-0'>Make Payment</p>
					<Button size={'sm'} className='px-6'>
						Pay
					</Button>
				</div>

				<div className='max-w-40'>
					<Calendar
						label='Payment Date'
						minDate={new Date()}
						changeFunction={handlePaymentDate}
						date={form.transactionDate}
					/>
				</div>

				<div className='my-4 text-sm font-medium'>
					<Label>Payment Source</Label>
					<Select onValueChange={handleAccount}>
						<SelectTrigger className='w-full'>
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
				<FormErrorText text={formError.sourceAccountName || ''} className='-mt-3 mb-2' />
				<div className='w-full number-input-div'>
					<Label>Amount</Label>
					<div className='input-box'>
						<span className='left-span'>$</span>
						<span className='right-span bg-white h-6 w-6' />
						<Input
							name='amount'
							type='number'
							min='1'
							step='0.01'
							value={form.amount}
							placeholder=''
							onChange={handleAmount}
						/>
					</div>
				</div>
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
			<ToastContainer position='bottom-left' />
		</div>
	);
}
