'use client';

import { useState, useEffect } from 'react';

import { STATIC_DATE_BUTTONS } from '@/lib/constants';

type Props = {
	handleButtons: (start: Date, end: Date) => void;
	reset: boolean;
	customSearch: boolean;
};

export default function StaticDateRanges({
	handleButtons,
	reset,
	customSearch,
}: Props) {
	const [buttonIndex, setButtonIndex] = useState(0);
	const handleButton = (id: number, range: number) => {
		setButtonIndex(id);
		const today = new Date();
		const endDate = new Date(today.setHours(23, 59, 59));
		const startDate: Date = new Date(
			new Date().setDate(today.getDate() - range)
		);
		handleButtons(startDate, endDate);
	};

	useEffect(() => {
		setButtonIndex(0);
	}, [reset]);

	useEffect(() => {
		if (customSearch) {
			setButtonIndex(-1);
		}
	}, [customSearch]);

	return (
		<div className='flex flex-wrap pb-3 '>
			{STATIC_DATE_BUTTONS.map(({ label, id, range }) => {
				const active = buttonIndex === id;
				return (
					<div
						key={label}
						className={`static-date-range-btn ${
							active ? 'bg-bank-green text-white ' : ''
						}`}
						onClick={() => handleButton(id, range)}
					>
						{label}
					</div>
				);
			})}
		</div>
	);
}
