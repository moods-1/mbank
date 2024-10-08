'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { Types } from 'mongoose';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';
import { updateClient } from '@/lib/store/clientSlice';
import {
	compareObjects,
	formValidator,
	randomString,
} from '@/lib/clientFunctions';
import SingleValueSelect from '@/components/SingleValueSelect';
import { PROVINCES_TERRITORIES } from '@/lib/constants';
import FormErrorText from '@/components/FormErrorText';
import FormHeader from '@/components/FormHeader';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from '@/components/ui/sheet';
import { clientUpdate } from '@/appInterface/client/client';

type Props = {
	open: boolean;
	openChange: () => void;
};
type FormType = {
	firstName: string;
	lastName: string;
	password?: string;
	email: string;
	city: string;
	province: string;
	country: string;
	address: string;
	postalCode: string;
	phoneNumber: string;
};

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

export default function Profile({ open, openChange }: Props) {
	const [form, setForm] = useState<FormType>(initialForm);
	const [formError, setFormError] = useState(initialForm);
	const [showPassword, setShowPassword] = useState<boolean | CheckedState>(
		false
	);
	const [disableSubmit, setDisableSubmit] = useState(true);
	const [selectKey, setSelectKey] = useState('province');
	const { client } = useAppSelector((state) => state.client);

	const dispatch = useAppDispatch();
	const clientObject = useMemo(() => {
		const {
			firstName,
			lastName,
			email,
			phoneNumber,
			address,
			city,
			province,
			postalCode,
			country,
		} = client;
		return {
			firstName,
			lastName,
			email,
			phoneNumber: phoneNumber.toString(),
			address,
			city,
			province,
			postalCode,
			password: '',
			country,
		};
	}, [client]);

	const clientName = `${form.firstName} ${form.lastName}`;

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let newPassword: boolean = false;
		if (form.password) {
			newPassword = true;
		} else {
			delete form.password;
		}
		const validatedData = formValidator(form);
		const { error, errorObject } = validatedData;
		setFormError(errorObject);
		if (error) {
			return null;
		}
		try {
			// Store or clear the client number in local storage
			let _id: Types.ObjectId | string = '';
			_id = client._id ? client._id : _id;
			const formObject = {
				...form,
				phoneNumber: Number(form.phoneNumber),
				newPassword,
				_id,
			};
			const result = await clientUpdate(formObject);
			if (result && 'firstName' in result) {
				setForm(initialForm);
				setFormError(initialForm);
				setSelectKey(randomString(4));
				dispatch(updateClient(result));
				openChange();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleOpenChange = () => {
		setForm({ ...clientObject });
		setFormError(initialForm);
		openChange();
	};

	useEffect(() => {
		if (clientObject.firstName) {
			setForm((prev) => ({
				...prev,
				...clientObject,
			}));
		}
	}, [clientObject]);

	useEffect(() => {
		const checkChange = async () => {
			setDisableSubmit(await compareObjects(clientObject, form));
		};
		checkChange();
	}, [form, clientObject]);

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className='profile-content'>
				<form onSubmit={handleSubmit} className='pt-4 sm:w-[500px]'>
					<FormHeader className='flex flex-col gap-1 items-center flex-wrap'>
						<FaUserEdit size={30} className='text-green-600' />
						<SheetTitle className='form-title-md'>{clientName}</SheetTitle>
					</FormHeader>
					<SheetDescription>
						<span className='inline-block mb-3 text-black'>{`* Updates take effect immediately.`}</span>
					</SheetDescription>
					<div className='form-section !gap-y-0'>
						<div>
							<CustomInput
								name='firstName'
								placeholder='Enter first name'
								value={form.firstName}
								changeFunction={handleChange}
								label='First Name'
								invalid={formError.firstName ? true : false}
							/>
							<FormErrorText
								text={formError.firstName}
								className='-mt-3 mb-2'
							/>
						</div>
						<div>
							<CustomInput
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
					<div className='form-section !gap-y-0'>
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
					<div className='form-section !gap-y-0'>
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
					<div className='form-section !gap-y-0'>
						<div>
							<SingleValueSelect
								reset={selectKey}
								defaultValue={form.province}
								label='Province / Territory'
								data={Object.values(PROVINCES_TERRITORIES)}
								name='province'
								placeholder='Enter province'
								changeFunction={handleProvince}
							/>
							<FormErrorText text={formError.province} className='-mt-3 mb-2' />
						</div>
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
							<FormErrorText
								text={formError.postalCode}
								className='-mt-3 mb-2'
							/>
						</div>
					</div>
					<div className='form-section !gap-y-0'>
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
								name='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Enter password'
								value={form.password || ''}
								changeFunction={handleChange}
								className='focus:border-gray-400'
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
					</div>
					<div className='mt-6'>
						<Button
							className='auth-form-button no-focus green-button'
							disabled={disableSubmit}
							type='submit'
						>
							Update
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
