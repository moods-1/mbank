'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';

import { loadClient } from '@/lib/store/clientSlice';
import { useAppDispatch } from '@/lib/store/store';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { loginClient } from '@/appInterface/actions/clientActions';
import {
	clearClientNumber,
	formValidator,
	getClientNumber,
	storeClientNumber,
} from '@/lib/clientFunctions';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import HoverButton from '@/components/HoverButton';
import { Loader } from '@/components/Loaders';

const intialFormError = { clientNumber: '', password: '' };

export default function LogIn() {
	const [form, setForm] = useState({ clientNumber: '8000', password: '' });
	const [rememberMe, setRememberMe] = useState<boolean | CheckedState>(false);
	const [formError, setFormError] = useState(intialFormError);
	const [showPassword, setShowPassword] = useState<boolean | CheckedState>(
		false
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
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
			setIsSubmitting(true);
			const result = await loginClient(formObject);
			if (
				typeof result === 'object' &&
				'accounts' in result &&
				'client' in result
			) {
				dispatch(loadClient(result));
				router.push('/client');
			} else if (typeof result === 'string' && result.includes('password')) {
				setFormError((prev) => ({ ...prev, password: result }));
				setIsSubmitting(false);
			} else if (typeof result === 'string' && result.includes('client')) {
				setFormError((prev) => ({ ...prev, clientNumber: result }));
				setIsSubmitting(false);
			}
		} catch (error) {
			console.log(error);
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		const clientNumber = getClientNumber();
		if (clientNumber) {
			setForm((prev) => ({ ...prev, clientNumber }));
			setRememberMe(true);
		} else setRememberMe(false);
	}, []);

	const testAutofill = () => {
		setForm({ clientNumber: '800000001', password: '1234Ds' });
	};

	return (
		<div className='auth-section'>
			<form className='auth-form max-w-sm' onSubmit={handleSubmit}>
				<FormHeader className='!mb-8'>
					<p className='form-title-lg text-center'>Login</p>
				</FormHeader>
				{!form.password && (
					<HoverButton
						title='Use Test Credentials'
						className='h-10 -mt-14 mb-6 !text-base'
						clickFunction={testAutofill}
					/>
				)}

				<CustomInput
					className='input-effects'
					name='clientNumber'
					placeholder='Enter card number'
					value={form.clientNumber}
					changeFunction={handleChange}
					label='Client Number'
					max={9}
					invalid={formError.clientNumber ? true : false}
				/>
				<FormErrorText text={formError.clientNumber} className='-mt-3 mb-2' />
				<CustomInput
					className='input-effects'
					name='password'
					type={showPassword ? 'text' : 'password'}
					placeholder='Enter password'
					value={form.password}
					changeFunction={handleChange}
					label='Password(case sensitive)'
					invalid={formError.password ? true : false}
				/>
				<FormErrorText text={formError.password} className='-mt-3 mb-2' />
				<div className='flex justify-between gap-5 flex-wrap'>
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
					<span className='flex items-center mt-3'>
						<Checkbox
							id='loginRememberMe'
							className='mr-2 border-gray-400 data-[state=checked]:bg-bank-green data-[state=checked]:border-none'
							checked={rememberMe}
							onCheckedChange={(e) => setRememberMe(e)}
						/>
						<Label htmlFor='loginRememberMe' className='!mb-0'>
							Remember me
						</Label>
					</span>
				</div>

				<div className='mt-6'>
					<HoverButton
						title='Login'
						className='h-10'
						disabled={isSubmitting}
						element={isSubmitting ? <Loader color='#fff' size='30px' /> : null}
					/>
				</div>
				<p className='mt-3'>
					{"Don't have an account?"}
					<Link href='/sign-up' className='ml-2 text-green-700'>
						Sign-up
					</Link>
				</p>
			</form>
		</div>
	);
}
