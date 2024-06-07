import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Props = {
	value: string | number;
	changeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	className?: string;
	label?: string;
	type?: string;
	name: string;
	max?: number;
	min?: number;
	required?: boolean;
	invalid?: boolean;
	requiredStar?: boolean;
	readOnly?: boolean;
};

const CustomInput = ({
	value,
	placeholder,
	changeFunction,
	className,
	label,
	type,
	name,
	max,
	min,
	invalid,
	required,
	requiredStar,
	readOnly,
}: Props) => {
	return (
		<div className='mb-4'>
			{label ? (
				<div className='flex'>
					<Label>{label}</Label>
					{requiredStar && <span className='text-red-600'>*</span>}
				</div>
			) : null}

			<Input
				className={`w-full outline-none border rounded-sm px-3  ${className}`}
				value={value}
				placeholder={placeholder}
				onChange={changeFunction}
				type={type || 'text'}
				name={name || ''}
				maxLength={max || 30}
				minLength={min || 1}
				style={{ borderColor: invalid ? 'red' : '' }}
				required={required || false}
				readOnly={readOnly}
				autoComplete={type === 'password' ? 'on' : 'off'}
			/>
		</div>
	);
};

export default CustomInput;
