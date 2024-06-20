'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from './ui/label';
import { Types } from 'mongoose';

type Option = {
	value: any;
	label: string;
};

type Props = {
	reset: string;
	placeholder?: string;
	name: string;
	emptyMessage: string;
	label: string;
	options: Option[];
	changeFunction: (value: any, name: string) => void;
	invalid?: boolean;
};

export function SearchableInput({
	reset,
	placeholder,
	name,
	emptyMessage,
	label,
	options,
	changeFunction,
	invalid,
}: Props) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

	const handleValue = (value: any) => {
		changeFunction(value, name);
		setValue(value);
		setOpen(false);
	};

	return (
		<div className='mb-4'>
			{label ? <Label>{label}</Label> : null}
			<Popover open={open} onOpenChange={setOpen} key={reset}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full h-9 justify-between no-focus input-effects rounded-none'
						style={{ borderColor: invalid ? 'red' : '' }}
					>
						{value
							? options.find((item) => item.value === value)?.label
							: placeholder}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0'>
					<Command>
						<CommandInput placeholder={placeholder || 'Search ...'} />
						<CommandList>
							<CommandEmpty>{emptyMessage}</CommandEmpty>
							<CommandGroup>
								{options.map((item) => (
									<CommandItem
										className='select-item'
										key={item.value}
										value={item.value}
										onSelect={(currentValue) =>
											handleValue(currentValue === value ? '' : currentValue)
										}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === item.value ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
