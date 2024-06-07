'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { Label } from '@/components/ui/label';

type Props = {
	className?: string | undefined;
	label: string | undefined;
	minDate?: Date;
	comparisonDate?: Date | undefined;
	date?: Date | undefined;
	changeFunction: (data: Date) => void;
};

const Calendar = ({ label,date, minDate, changeFunction }: Props) => {
	return (
		<div>
			<Label className='mb-1'>{label || ''}</Label>
			<DatePicker
				showIcon
				selected={date}
				minDate={minDate || new Date('1900-01-01')}
				onChange={(date:Date)=> changeFunction(date)}
				dateFormat='MMMM do, yyyy'
				className='calendar-input'
				wrapperClassName='calendar-wrapper'
			/>
		</div>
	);
};
export default Calendar;
