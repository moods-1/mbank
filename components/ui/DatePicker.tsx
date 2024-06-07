'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { SelectSingleEventHandler } from 'react-day-picker';

type Props = {
	className?: string | undefined;
	label: string | undefined;
	type: string | undefined;
	comparisonDate?: Date | undefined;
	date: Date | undefined;
	changeFunction: (data: Date) => void;
	disableBeforeDate?: Date;
};
export function DatePicker({
	className,
	label,
	type,
	date,
	changeFunction,
	disableBeforeDate,
}: Props) {
	const [calendarOpen, setCalendarOpen] = React.useState<boolean>(false);

	const handleSelect: SelectSingleEventHandler = (data) => {
		let value: Date;
		if (data) {
			if (type === 'end') {
				// Set end date to 11:59:59 PM of the selected date
				value = new Date(data.setHours(23, 59, 59));
			} else if (type === 'start') {
				// Set start date to 00:00:01 AM of the selected date
				value = new Date(data.setHours(0, 0, 1));
			} else {
				value = data;
			}
			changeFunction(value);
			setCalendarOpen(false);
		}
	};

	const handleDisabled = (date: Date) => {
		if (disableBeforeDate) {
			return date < disableBeforeDate;
		}
		return false;
	};

	return (
		<div className={`flex flex-col ${className}`}>
			<Label className='mb-1'>{label || ''}</Label>
			<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full min-w-48 max-w-[280px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
						onClick={() => setCalendarOpen((prev) => !prev)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? format(date, 'PPP') : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={handleSelect}
						initialFocus
						disabled={handleDisabled}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
