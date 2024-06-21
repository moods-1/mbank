'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { HiHandThumbUp } from 'react-icons/hi2';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';
import { addClient } from '@/appInterface/actions/clientActions';
import { formValidator, randomString } from '@/lib/clientFunctions';
import NotificationModal from '@/components/modals/NotificationModal';
import SingleValueSelect from '@/components/SingleValueSelect';
import { PROVINCES_TERRITORIES } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';

const initialForm = {
	firstName: '',
	lastName: '',
	password: '',
	email: '',
	city: '',
	province: '',
	country: 'Canada',
	address: '',
	postalCode: '',
	phoneNumber: '',
};

export default function SignUp() {
	const [form, setForm] = useState(initialForm);
	const [formError, setFormError] = useState(initialForm);
	const [openNotification, setOpenNotification] = useState(false);
	const [clientNumber, setClientNumber] = useState<string | number>('');
	const [clientName, setClientName] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean | CheckedState>(
		false
	);
	const [selectKey, setSelectKey] = useState('province');
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormError(initialForm);
		const { value, name } = e.target;
		let localValue: string;
		if (name === 'password') {
			localValue = value.replace(/[\W]/g, '');
		} else if (name === 'postalCode') {
			localValue = value.replace(/[\W]/g, '').toUpperCase();
		} else if (name === 'phoneNumber') {
			localValue = value.replace(/[^0-9]/g, '');
		} else if (name === 'email') {
			localValue = value.replace(' ', '');
		} else {
			localValue = value.replace(/\s{2,}/g, ' ').trimStart();
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
	};

	const handleProvince = (e: string, field: string) => {
		setFormError(initialForm);
		setForm((prev) => ({ ...prev, [field]: e }));
	};

	const handleNotification = () => {
		setOpenNotification(false);
		router.push('/login');
	};

	const notificationProps = {
		title: 'Sign up successful!',
		body: `${clientName}, use this client number ${clientNumber} and your password to log into your account.`,
		buttonText: 'Login Page',
		buttonFunction: handleNotification,
		buttonClass: 'bg-black text-bank-green',
		open: openNotification,
		openChange: setOpenNotification,
		icon: (
			<div className='w-14 h-14 rounded-full bg-bank-green flex-center mx-auto text-white'>
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
			// Store or clear the client number in local storage
			const formObject = { ...form, phoneNumber: Number(form.phoneNumber) };
			const result = await addClient(formObject);
			const resultType = typeof result;
			if (resultType === 'object' && Object.keys(result).length) {
				const { clientNumber } = result;
				setClientNumber(clientNumber);
				setClientName(form.firstName);
				setForm(initialForm);
				setFormError(initialForm);
				setOpenNotification(true);
				setSelectKey(randomString(4));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='auth-section'>
			<form className='auth-form max-w-lg border' onSubmit={handleSubmit}>
				<FormHeader className='!mb-8'>
					<p className='form-title-lg text-center'>Sign Up</p>
				</FormHeader>
				<div className='form-section'>
					<div>
						<CustomInput
							className='input-effects'
							name='firstName'
							placeholder='Enter first name'
							value={form.firstName}
							changeFunction={handleChange}
							label='First Name'
							invalid={formError.firstName ? true : false}
						/>
						<FormErrorText text={formError.firstName} className='-mt-3 mb-2' />
					</div>
					<div>
						<CustomInput
							className='input-effects'
							name='lastName'
							placeholder='Enter last name'
							value={form.lastName}
							changeFunction={handleChange}
							label='Last Name'
							invalid={formError.lastName ? true : false}
						/>
						<FormErrorText text={formError.lastName} className='-mt-3 mb-2' />
					</div>
				</div>
				<div className='form-section'>
					<div>
						<CustomInput
							className='input-effects'
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
							className='input-effects'
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
							className='input-effects'
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
						<CustomInput
							className='input-effects'
							name='city'
							placeholder='Enter city'
							value={form.city}
							changeFunction={handleChange}
							label='City'
							invalid={formError.city ? true : false}
						/>
						<FormErrorText text={formError.city} className='-mt-3 mb-2' />
					</div>
					<div>
						<SingleValueSelect
							reset={selectKey}
							label='Province / Territory'
							data={Object.values(PROVINCES_TERRITORIES)}
							name='province'
							placeholder='Enter province'
							changeFunction={handleProvince}
						/>
						<FormErrorText text={formError.province} className='-mt-3 mb-2' />
					</div>
				</div>
				<div className='form-section'>
					<CustomInput
						className='input-effects'
						name='country'
						placeholder='Canada'
						readOnly
						value={form.country}
						changeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {}}
						label='Country'
					/>
					<div>
						<CustomInput
							className='input-effects'
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
				<div>
					<CustomInput
						name='password'
						type={showPassword ? 'text' : 'password'}
						placeholder='Enter password'
						value={form.password}
						changeFunction={handleChange}
						className='input-effects'
						label='Password(case sensitive)'
						invalid={formError.password ? true : false}
					/>
					<FormErrorText text={formError.password} className='-mt-3 mb-2' />
					<span className='flex items-center mt-3'>
						<Checkbox
							id='loginShowPassword'
							className='mr-2 border-gray-400 data-[state=checked]:bg-bank-green data-[state=checked]:border-none'
							onCheckedChange={(e) => setShowPassword(e)}
						/>
						<Label htmlFor='loginShowPassword' className='!mb-0'>
							Show password
						</Label>
					</span>
				</div>
				<div className='mt-6'>
					<Button className='auth-form-button no-focus green-button'>
						Sign Up
					</Button>
				</div>
				<p className='mt-3'>
					{'Already have an account?'}
					<Link href='/login' className='ml-2 text-green-700'>
						Login
					</Link>
				</p>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>
	);
}
