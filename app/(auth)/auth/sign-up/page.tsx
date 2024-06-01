'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiHandThumbUp } from 'react-icons/hi2';

import { loadClient } from '@/lib/store/clientSlice';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import CustomInput from '@/components/CustomImput';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';
import { addClient } from '@/api/actions/clientActions';
import { clearPersist, formValidator } from '@/lib/clientFunctions';
import NotificationModal from '@/components/modals/NotificationModal';
import Link from 'next/link';

const initialForm = {
	firstName: '',
	lastName: '',
	password: '',
	email: '',
	city: '',
	country: 'Canada',
	address: '',
	postalCode: '',
	phoneNumber: '',
};

export default function LogIn() {
	const [form, setForm] = useState(initialForm);
	const [formError, setFormError] = useState(initialForm);
	const [openNotification, setOpenNotification] = useState(false);
	const [clientNumber, setClientNumber] = useState<string | number>('');
	const [showPassword, setShowPassword] = useState<boolean | CheckedState>(
		false
	);
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
		} else if (name === 'email') {
			localValue = value.replace(' ', '');
		} else {
			localValue = value.replace(/\s{2,}/g, ' ').trimStart();
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
	};

	const handleNotification = () => {
		setOpenNotification(false);
		router.push('/auth/login');
	};

	const notificationProps = {
		title: 'Sign up successful!',
		body: `${form.firstName}, use this client number ${clientNumber} and your password to log into your account.`,
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
				setForm(initialForm);
				setFormError(initialForm);
				setOpenNotification(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		// <section>
		<div className='auth-section'>
			<form className='auth-form max-w-lg' onSubmit={handleSubmit}>
				<p className='page-title text-center'>Sign Up</p>
				<div className='form-section'>
					<div>
						<CustomInput
							name='firstName'
							placeholder='Enter first name'
							value={form.firstName}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='First Name'
							invalid={formError.firstName ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.firstName || ''}</p>
					</div>
					<div>
						<CustomInput
							name='lastName'
							placeholder='Enter last name'
							value={form.lastName}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='Last Name'
							invalid={formError.lastName ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.lastName || ''}</p>
					</div>
				</div>
				<div className='form-section'>
					<div>
						<CustomInput
							name='email'
							placeholder='Enter email'
							value={form.email}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='Email'
							type='email'
							max={50}
							invalid={formError.email ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.email || ''}</p>
					</div>
					<div>
						<CustomInput
							name='phoneNumber'
							placeholder='Enter phone number'
							value={form.phoneNumber}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='Phone Number'
							max={10}
							invalid={formError.phoneNumber ? true : false}
						/>
						<p className='text-red-700 text-sm'>
							{formError.phoneNumber || ''}
						</p>
					</div>
				</div>
				<div className='form-section'>
					<div>
						<CustomInput
							name='city'
							placeholder='Enter city'
							value={form.city}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='City'
							invalid={formError.city ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.city || ''}</p>
					</div>
					<div>
						<CustomInput
							name='country'
							placeholder='Canada'
							readOnly
							value={form.country}
							changeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {}}
							className={`focus:border-bank-green`}
							label='Country'
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
							className={`focus:border-bank-green`}
							label='Address'
							max={60}
							invalid={formError.address ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.address || ''}</p>
					</div>
					<div>
						<CustomInput
							name='postalCode'
							placeholder='Enter postal code'
							value={form.postalCode}
							changeFunction={handleChange}
							className={`focus:border-bank-green`}
							label='Postal Code'
							max={6}
							invalid={formError.postalCode ? true : false}
						/>
						<p className='text-red-700 text-sm'>{formError.postalCode || ''}</p>
					</div>
				</div>

				<CustomInput
					name='password'
					type={showPassword ? 'text' : 'password'}
					placeholder='Enter password'
					value={form.password}
					changeFunction={handleChange}
					className='focus:border-bank-green'
					label='Password(case sensitive)'
					invalid={formError.password ? true : false}
				/>
				<p className='text-red-700 text-sm'>{formError.password || ''}</p>
				<span className='flex items-center mt-3'>
					<Checkbox
						id='loginShowPassword'
						className='mr-2 border-gray-400 data-[state=checked]:bg-bank-green data-[state=checked]:border-none'
						onCheckedChange={(e) => setShowPassword(e)}
					/>
					<Label htmlFor='loginShowPassword'>Show password</Label>
				</span>
				<div className='mt-6'>
					<Button className='auth-form-button no-focus'>Sign Up</Button>
				</div>
				<p className='mt-3'>
					{'Already have an account?'}
					<Link href='/auth/login' className='ml-2 text-green-700'>
						Login
					</Link>
				</p>
			</form>
			{openNotification ? <NotificationModal {...notificationProps} /> : null}
		</div>

		// </section>
	);
}
