'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { loadClient } from '@/lib/store/clientSlice';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';
import { loginClient } from '@/api/actions/clientActions';
import {
	clearClientNumber,
	clearPersist,
	formValidator,
	getClientNumber,
	storeClientNumber,
} from '@/lib/clientFunctions';
import Link from 'next/link';
import FormErrorText from '@/components/FormErrorText';

const intialFormError = { clientNumber: '', password: '' };

export default function LogIn() {
	const [form, setForm] = useState({ clientNumber: '8000', password: '' });
	const [rememberMe, setRememberMe] = useState<boolean | CheckedState>(false);
	const [formError, setFormError] = useState(intialFormError);
	const [showPassword, setShowPassword] = useState<boolean | CheckedState>(
		false
	);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormError(intialFormError);
		const { value, name } = e.target;
		let localValue: string;
		if (name === 'clientNumber') {
			localValue = value.replace(/[^0-9]/g, '');
		} else if (name === 'password') {
			localValue = value.replace(/[\W]/g, '');
		}
		setForm((prev) => ({ ...prev, [name]: localValue }));
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
			rememberMe ? storeClientNumber(form.clientNumber) : clearClientNumber();
			const formObject = { ...form, clientNumber: Number(form.clientNumber) };
			const result = await loginClient(formObject);
			const resultType = typeof result;
			if (resultType === 'object' && Object.keys(result).length) {
				clearPersist();
				dispatch(loadClient(result));
				router.push('/client');
			} else if (resultType === 'string' && result.includes('password')) {
				setFormError((prev) => ({ ...prev, password: result }));
			} else if (resultType === 'string' && result.includes('client')) {
				setFormError((prev) => ({ ...prev, clientNumber: result }));
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const clientNumber = getClientNumber();
		if (clientNumber) {
			setForm((prev) => ({ ...prev, clientNumber }));
			setRememberMe(true);
		} else setRememberMe(false);
	}, []);

	return (
		<div className='auth-section'>
			<form className='auth-form max-w-sm' onSubmit={handleSubmit}>
				<p className='page-title text-center'>Login</p>
				<CustomInput
					name='clientNumber'
					placeholder='Enter card number'
					value={form.clientNumber}
					changeFunction={handleChange}
					className={`focus:border-bank-green`}
					label='Client Number'
					invalid={formError.clientNumber ? true : false}
				/>
				<FormErrorText text={formError.clientNumber} className='-mt-3 mb-2' />
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
				<FormErrorText text={formError.password} className='-mt-3 mb-2'/>
				<div className='flex justify-between gap-5 flex-wrap'>
					<span className='flex items-center mt-3'>
						<Checkbox
							id='loginShowPassword'
							className='mr-2 border-gray-400 data-[state=checked]:bg-bank-green data-[state=checked]:border-none'
							onCheckedChange={(e) => setShowPassword(e)}
						/>
						<Label htmlFor='loginShowPassword'>Show password</Label>
					</span>
					<span className='flex items-center mt-3'>
						<Checkbox
							id='loginRememberMe'
							className='mr-2 border-gray-400 data-[state=checked]:bg-bank-green data-[state=checked]:border-none'
							checked={rememberMe}
							onCheckedChange={(e) => setRememberMe(e)}
						/>
						<Label htmlFor='loginRememberMe'>Remember me</Label>
					</span>
				</div>

				<div className='mt-6'>
					<Button className='w-full bg-bank-green'>Login</Button>
				</div>
				<p className='mt-3'>
					{"Don't have an account?"}
					<Link href='/auth/sign-up' className='ml-2 text-green-700'>
						Sign-up
					</Link>
				</p>
			</form>
		</div>
	);
}
