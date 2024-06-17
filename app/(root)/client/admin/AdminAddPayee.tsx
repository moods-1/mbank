'use client';

import { useState } from 'react';
import { HiHandThumbUp } from 'react-icons/hi2';

import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import { formValidator, postalCodeGood, randomString } from '@/lib/clientFunctions';
import NotificationModal from '@/components/modals/NotificationModal';
import { adminAddPayee } from '@/api/actions/payeeActions';
import { PAYEE_BUSINESS_TYPES, PROVINCES_TERRITORIES } from '@/lib/constants';
import SingleValueSelect from '@/components/SingleValueSelect';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';

const initialForm = {
	payeeName: '',
	email: '',
	city: '',
	province: '',
	country: 'Canada',
	address: '',
	postalCode: '',
	phoneNumber: '',
	businessType: '',
};

export default function AddPayee() {
	const [form, setForm] = useState(initialForm);
	const [selectKeys, setSelectKeys] = useState({
		province: 'on',
		business: 'bus',
	});
	const [formError, setFormError] = useState(initialForm);
	const [openNotification, setOpenNotification] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormError(initialForm);
		const { value, name } = e.target;
		let localValue: string;
		if (name === 'postalCode') {
			localValue = value.replace(/[\W]/g, '').toUpperCase();
		} else if (name === 'email') {
			localValue = value.replace(' ', '');
		} else if (name === 'phoneNumber') {
			localValue = value.replace(/[^0-9]/g, '');
		} else {
			localValue = value.replace(/\s{2,}/g, ' ').trimStart();
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
	};

	const handleSelect = (e: string, field: string) => {
		setFormError(initialForm);
		setForm((prev) => ({ ...prev, [field]: e }));
	};

	const handleNotification = () => {
		setForm(initialForm);
		setOpenNotification(false);
	};

	const notificationProps = {
		title: 'Sign up successful!',
		body: `${form.payeeName} has been added as a payee.`,
		buttonText: 'Close',
		buttonFunction: handleNotification,
		buttonClass: 'bg-black text-bank-green',
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
			const formObject = { ...form, phoneNumber: Number(form.phoneNumber) };
			const result = await adminAddPayee(formObject);
			const resultType = typeof result;
			if (result && resultType === 'object' && Object.keys(result).length) {
				setFormError(initialForm);
				setOpenNotification(true);
				setSelectKeys({ province: randomString(4), business: randomString(4) });
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='auth-section'>
			<form className='auth-form max-w-lg border' onSubmit={handleSubmit}>
				<FormHeader className='!mb-10'>
					<p className='form-title-lg text-center'>Add Payee</p>
				</FormHeader>

				<div className='form-section'>
					<div>
						<CustomInput
							name='payeeName'
							placeholder='Enter payee name'
							value={form.payeeName}
							changeFunction={handleChange}
							label='Payee Name'
							invalid={formError.payeeName ? true : false}
						/>
						<FormErrorText text={formError.payeeName} className='-mt-3 mb-2' />
					</div>
					<div>
						<SingleValueSelect
							reset={selectKeys.business}
							invalid={formError.businessType ? true : false}
							label='Business Type'
							name='businessType'
							placeholder='Select business type'
							data={Object.values(PAYEE_BUSINESS_TYPES)}
							changeFunction={handleSelect}
						/>
						<FormErrorText
							text={formError.businessType}
							className='-mt-3 mb-2'
						/>
					</div>
				</div>
				<div className='form-section'>
					<div>
						<CustomInput
							name='email'
							placeholder='Enter email'
							value={form.email}
							changeFunction={handleChange}
							label='Email'
							type='email'
							max={50}
							invalid={formError.email ? true : false}
						/>
						<FormErrorText text={formError.email} className='-mt-3 mb-2' />
					</div>
					<div>
						<CustomInput
							name='phoneNumber'
							placeholder='Enter phone number'
							value={form.phoneNumber}
							changeFunction={handleChange}
							label='Phone Number'
							max={10}
							invalid={formError.phoneNumber ? true : false}
						/>
						<FormErrorText
							text={formError.phoneNumber}
							className='-mt-3 mb-2'
						/>
					</div>
				</div>
				<div className='form-section'>
					<div>
						<CustomInput
							name='address'
							placeholder='Enter address'
							value={form.address}
							changeFunction={handleChange}
							label='Address'
							max={60}
							invalid={formError.address ? true : false}
						/>
						<FormErrorText text={formError.address} className='-mt-3 mb-2' />
					</div>
				</div>
				<div className='form-section'>
					<div>
						<SingleValueSelect
							reset={selectKeys.province}
							invalid={formError.province ? true : false}
							label='Province / Territory'
							data={Object.values(PROVINCES_TERRITORIES)}
							name='province'
							placeholder='Select province'
							changeFunction={handleSelect}
						/>
						<FormErrorText text={formError.province} className='-mt-3 mb-2' />
					</div>
					<div>
						<CustomInput
							name='city'
							placeholder='Enter city'
							value={form.city}
							changeFunction={handleChange}
							label='City'
							invalid={formError.city ? true : false}
						/>
						<FormErrorText text={formError.city} className='-mt-3 mb-2' />
					</div>
				</div>
				<div className='form-section'>
					<CustomInput
						name='country'
						placeholder='Canada'
						readOnly
						value={form.country}
						changeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {}}
						label='Country'
					/>
					<div>
						<CustomInput
							name='postalCode'
							placeholder='Enter postal code'
							value={form.postalCode}
							changeFunction={handleChange}
							label='Postal Code'
							max={6}
							invalid={formError.postalCode ? true : false}
						/>
						<FormErrorText text={formError.postalCode} className='-mt-3 mb-2' />
					</div>
				</div>
				<div className='mt-6'>
					<Button className='auth-form-button no-focus'>Add Payee</Button>
				</div>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>
	);
}
