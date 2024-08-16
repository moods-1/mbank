'use client';

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';

import { useAppDispatch } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import CustomInput from '@/components/CustomInput';
import {
	formatPayeeOptions,
	formValidator,
	randomString,
} from '@/lib/clientFunctions';
import { payeeAdd } from '@/appInterface/client/client';
import { PayeeType, PublicClientType } from '@/lib/types';
import { getPayees } from '@/appInterface/client/payee';
import { SearchableInput } from '@/components/SearchableInput';
import { Types } from 'mongoose';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import HoverButton from '@/components/HoverButton';

type AddPayeeType = {
	payeeId: Types.ObjectId | string | any;
	payeeName: string;
	accountNumber: string;
	nickname: string;
};

const initialErrorObj: AddPayeeType = {
	payeeId: '',
	payeeName: '',
	accountNumber: '',
	nickname: '',
};

export default function AddPayee({ client }: { client: PublicClientType }) {
	const [form, setForm] = useState<AddPayeeType>(initialErrorObj);
	const [selectKey, setSelectKey] = useState('payee');
	const [payees, setPayees] = useState<PayeeType[]>([]);
	const [formError, setFormError] = useState<AddPayeeType>(initialErrorObj);
	const dispatch = useAppDispatch();
	const payeeOptions = formatPayeeOptions(payees);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormError(initialErrorObj);
		const { name, value } = e.target;
		let localValue: string;
		if (name === 'accountNumber') {
			localValue = value.replace(' ', '');
		} else {
			localValue = value.replace(/\s{2,}/g, ' ').trimStart();
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
	};

	const handleSelect = (value: any, name: string) => {
		if (name === 'payeeId') {
			const [payeeId, payeeName] = value.split(',');
			setForm((prev) => ({ ...prev, payeeId, payeeName }));
		}
	};

	const reset = async () => {
		setForm(initialErrorObj);
		setFormError(initialErrorObj);
		setSelectKey(randomString(3));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validatedData = formValidator(form);
		const { error, errorObject } = validatedData;
		setFormError(errorObject);
		if (error) return null;
		try {
			const { clientNumber } = client;
			const queryObject = { ...form, clientNumber };
			const result = await payeeAdd(queryObject);
			if (result && 'status' in result) {
				const { status, msg, response } = result;
				if (status < 300) {
					dispatch(updateClient(response));
					await reset();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const fetchPayees = async () => {
			const result = await getPayees();
			if (result && 'status' in result) {
				const { status, response } = result;
				if (status < 300) {
					setPayees(response);
				}
			}
		};
		fetchPayees();
	}, []);

	return (
		<div>
			<form className='pay-transfer-card max-w-72' onSubmit={handleSubmit}>
				<FormHeader className='bg-black text-white p-3 sm:px-6'>
					<p className='form-title-sm'>Add Payee</p>
					<p className='text-sm'>Add a billing entity</p>
				</FormHeader>
				<div className='pay-transfer-card-content'>
					<SearchableInput
						reset={selectKey}
						placeholder='Select payee'
						name='payeeId'
						emptyMessage='No payee found.'
						label='Payee Name'
						options={payeeOptions}
						changeFunction={handleSelect}
						invalid={formError.payeeName ? true : false}
					/>
					<FormErrorText
						text={formError.payeeName || ''}
						className='-mt-3 mb-2'
					/>
					<CustomInput
						className='input-effects'
						name='accountNumber'
						placeholder='Enter account number'
						value={form.accountNumber}
						changeFunction={handleChange}
						label='Payee Account Number'
						invalid={formError.accountNumber ? true : false}
					/>
					<FormErrorText
						text={formError.accountNumber || ''}
						className='-mt-3 mb-2'
					/>
					<CustomInput
						className='input-effects'
						name='nickname'
						placeholder='Enter account nickname'
						value={form.nickname}
						changeFunction={handleChange}
						label='Payee Nickname'
						invalid={formError.nickname ? true : false}
					/>
					<FormErrorText
						text={formError.nickname || ''}
						className='-mt-3 mb-2'
					/>
					<HoverButton title='Add Payee' className='h-10 mt-2' />
					<div className='add-payee-info'>
						<span className='app-payee-info-icon'>i</span>
						<span className='app-payee-info-box'>
							<Link href='/contact-us' className='text-bank-green font-medium'>
								Contact us
							</Link>{' '}
							if you do not see a payee that you would like to add.
						</span>
					</div>
				</div>
			</form>
		</div>
	);
}
