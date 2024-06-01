import React from 'react';

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
		<div className='mt-3'>
			{label && (
				<div className='flex'>
					<label className='text-sm inline-block font-semibold'>{label}</label>
					{requiredStar && <span className='text-red-600'>*</span>}
				</div>
			)}

			<input
				className={`w-full outline-none border rounded-sm px-3 py-1 ${className}`}
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
			/>
		</div>
	);
};

export default CustomInput;
