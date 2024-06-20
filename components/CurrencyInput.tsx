import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';

type Props = {
	className?: string;
	label?: string;
	id?: string;
	name?: string;
	min?: string;
	step?: number;
	invalid?: boolean;
	value: string | number;
	changeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

export default function CurrencyInput({
	className,
	label,
	id,
	name,
	min,
	step,
	invalid,
	value,
	changeFunction,
	placeholder,
}: Props) {
	return (
		<div className='w-full flex flex-col mb-4'>
			{label ? <Label>{label}</Label> : null}
			<div
				className={`h-9 border relative flex items-center ${className}`}
				style={{ borderColor: invalid ? 'red' : '' }}
			>
				<span className='ml-2 text-sm'>$</span>
				<span className='absolute right-1 bg-white h-6 w-6' />
				<Input
					type='number'
					id={id || ''}
					name={name || ''}
					min={min || '0'}
					className='no-focus border-none pl-1 h-8'
					step={step || 0.01}
					value={value}
					placeholder={placeholder || ''}
					onChange={changeFunction}
				/>
			</div>
		</div>
	);
}
