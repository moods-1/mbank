import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Props = {
	reset: string;
	invalid?: boolean;
	label?: string;
	data: string[];
	name: string;
	placeholder: string | undefined;
	changeFunction: (e: string, field: string) => void;
};

export default function SingleValueSelect({
	reset,
	invalid,
	label,
	data,
	name,
	placeholder,
	changeFunction,
}: Props) {
	return (
		<div className='mb-4'>
			{label ? (
				<div className='flex'>
					{' '}
					<Label>{label}</Label>
				</div>
			) : null}
			<Select
				onValueChange={(e: string) => changeFunction(e, `${name}`)}
				name={name}
				key={reset}
			>
				<SelectTrigger
					className='w-full focus:border-bank-green'
					style={{ borderColor: invalid ? 'red' : '' }}
				>
					<SelectValue placeholder={placeholder || 'Select'} />
				</SelectTrigger>
				<SelectContent>
					{data.map((value) => (
						<SelectItem key={value} value={value} className='select-item'>
							<span>{value}</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
