import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';

type Props = {
	label?: string;
	id?: string;
	name?: string;
	min?: string;
	max?: string;
	maxLength?: number;
	step?: number;
	invalid?: boolean;
	value: string | number;
	changeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

export default function NumberInput({
	label,
	id,
	name,
	min,
	maxLength,
	step,
	invalid,
	value,
	changeFunction,
	placeholder,
}: Props) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (maxLength) {
			e.target.value = value.slice(0, 9);
		}
		changeFunction(e);
	};

	return (
		<div className='w-full flex flex-col mb-4'>
			{label ? <Label>{label}</Label> : null}
			<div
				className='h-9 border rounded-sm relative flex items-center focus-within:border-gray-400'
				style={{ borderColor: invalid ? 'red' : '' }}
			>
				<span className='absolute right-1 bg-white h-6 w-6 cursor-default' />
				<Input
					type='number'
					id={id || ''}
					name={name || ''}
					min={min || '0'}
					maxLength={maxLength || 30}
					className='no-focus border-none h-8'
					step={step || 0.01}
					value={value}
					placeholder={placeholder || ''}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}
