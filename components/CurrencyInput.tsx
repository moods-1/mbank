import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';

type Props = {
	label?: string;
	id?: string;
	name?: string;
	min?: string;
	step?: number;
	value: string | number;
	changeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

export default function CurrencyInput({
	label,
	id,
	name,
	min,
	step,
	value,
	changeFunction,
	placeholder,
}: Props) {
	return (
		<div className='w-full number-input-div'>
			{label ? <Label>{label}</Label> : null}
			<div className='input-box'>
            <span className='left-span'>$</span>
                <span className='right-span bg-white h-6 w-6' />
				<Input
					type='number'
					id={id || ''}
					name={name || ''}
					min={min || '0'}
					className='no-focus focus:border-bank-green'
					step={step || 0.01}
					value={value}
					placeholder={placeholder || ''}
					onChange={changeFunction}
				/>
			</div>
		</div>
	);
}
