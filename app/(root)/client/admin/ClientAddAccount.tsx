'use client';

import { useState, useEffect } from 'react';
import { HiHandThumbUp } from 'react-icons/hi2';

import { Button } from '@/components/ui/button';
import { formValidator, randomString } from '@/lib/clientFunctions';
import NotificationModal from '@/components/modals/NotificationModal';
import { ACCOUNT_TYPE_NUMBER } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import { AccountSelectType, AddAccountFormType } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { updateClient } from '@/lib/store/clientSlice';
import { accountAdd } from '@/api/client/accounts';
import CustomInput from '@/components/CustomInput';
import SingleValueSelectDisable from '@/components/SingleValueSelectDisable';

type Props = {
	clientNumber: number;
};

const initialForm = {
	clientNumber: '',
	accountName: '',
	accountType: '',
};

export default function AddAccount({ clientNumber }: Props) {
	const [form, setForm] = useState<AddAccountFormType>(initialForm);
	const [selectKey, setSelectKey] = useState<string>('accountName');
	const [formError, setFormError] = useState(initialForm);
	const [openNotification, setOpenNotification] = useState(false);
	const [selectOptions, setSelectOptions] =useState<AccountSelectType[]>([]);
	const { accounts } = useAppSelector((state) => state.client);
	const dispatch = useAppDispatch();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormError(initialForm);
		const { value, name } = e.target;
		let localValue: string;
		if (name === 'clientNumber') {
			localValue = value.replace(/[^0-9]/g, '');
		} else {
			localValue = value.replace(/\s{2,}/g, ' ').trimStart();
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
	};

	const handleSelect = (e: string, field: string) => {
		setFormError(initialForm);
		let accountType: string;
		// Get account type number/key by value
		const keyValue = Object.entries(ACCOUNT_TYPE_NUMBER).find(
			([_, value]) => value === e
		);
		// keyValue structure: [key,value]
		if (keyValue) {
			accountType = keyValue[0];
			setForm((prev) => ({ ...prev, [field]: e, accountType }));
		}
	};

	const handleNotification = () => {
		setForm(initialForm);
		setOpenNotification(false);
	};

	const notificationProps = {
		title: 'Success!',
		body: `The account has been added.`,
		buttonText: 'Close',
		buttonFunction: handleNotification,
		buttonClass: '',
		className: 'sm:w-80',
		open: openNotification,
		openChange: setOpenNotification,
		icon: (
			<div className='w-14 h-14 rounded-full bg-bank-green flex-center-row mx-auto text-white'>
				<HiHandThumbUp className='text-4xl' />
			</div>
		),
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validatedData = formValidator(form);
		const { error, errorObject } = validatedData;
		setFormError(errorObject);
		if (error) {
			return null;
		}
		try {
			const result = await accountAdd(form);
			if (result && 'firstName' in result) {
				setFormError(initialForm);
				setOpenNotification(true);
				setSelectKey(randomString(4));
				dispatch(updateClient(result));
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setForm((prev) => ({ ...prev, clientNumber }));
	}, [clientNumber]);

	useEffect(() => {
		const currentAccountsSet = new Set();
		const selectOptions: AccountSelectType[] = [];
		accounts.forEach(({ accountType }) => {
			currentAccountsSet.add(accountType);
		});
		Object.entries(ACCOUNT_TYPE_NUMBER).forEach(([key, value]) => {
			if (currentAccountsSet.has(key)) {
				selectOptions.push({ value, disabled: true });
			} else {
				selectOptions.push({ value, disabled: false });
			}
		});
		setSelectOptions(selectOptions);
	}, [accounts]);

	return (
		<div className='w-full mt-8'>
			<form
				className='auth-form w-full border mx-auto !min-h-20'
				onSubmit={handleSubmit}
			>
				<div>
					<CustomInput
						invalid={formError.clientNumber ? true : false}
						label='Client Number'
						name='clientNumber'
						min={0}
						max={9}
						readOnly
						value={form.clientNumber}
						placeholder='Enter client number'
						changeFunction={handleChange}
					/>
					<FormErrorText text={formError.clientNumber} className='-mt-3 mb-2' />
				</div>
				<div>
					<SingleValueSelectDisable
						reset={selectKey}
						invalid={formError.accountName ? true : false}
						label='Account'
						name='accountName'
						placeholder='Select account type'
						data={selectOptions}
						changeFunction={handleSelect}
					/>
					<FormErrorText text={formError.accountName} className='-mt-3 mb-2' />
				</div>

				<div className='mt-6'>
					<Button className='auth-form-button no-focus'>Add Account</Button>
				</div>
				<p className='text-sm mt-5 font-medium'>{`Upon successful account addition, we'll send you the appropriate paperwork digitally.`}</p>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>
	);
}
