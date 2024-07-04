import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
	hasMore: boolean;
	totalPages: number;
	handlePage: (paginationNumber: number) => void;
	className?: string;
}

export default function Pagination({
	hasMore,
	totalPages,
	handlePage,
	className,
}: Props) {
	const [selectedButton, setSelectedButton] = useState(1);

	const handleButton = (num: number) => {
		setSelectedButton(num);
		handlePage(num);
	};

	const navButton = (type: string) => {
		const currentPage = selectedButton;
		let newPage: number = 0;
		if (type === 'prev') {
			if (currentPage > 1) {
				newPage = currentPage - 1;
			}
		} else {
			if (currentPage < totalPages) {
				newPage = currentPage + 1;
			}
		}
		setSelectedButton(newPage);
		handlePage(newPage);
	};

	// Setup button array
	const buttons: number[] = [];
	for (let i = 0; i < totalPages; i++) {
		buttons.push(i + 1);
	}

	const disableNext = selectedButton === totalPages || !hasMore;
	const disablePrev = selectedButton === 1;

	return (
		<div className={cn('pagination', className)}>
			<button
				className={`pagination-nav ${
					disablePrev ? '!bg-gray-500' : 'hover:bg-gray-800'
				}`}
				onClick={() => navButton('prev')}
				disabled={disablePrev}
			>
				Prev
			</button>
			<span className='w-auto'>
				{buttons.map((number) => (
					<button
						key={number}
						className={`border w-auto px-2 py-[2px] text-center hover:bg-bank-green hover:text-white ${
							selectedButton === number ? 'active-button' : ''
						}`}
						onClick={() => handleButton(number)}
					>
						{number}
					</button>
				))}
			</span>
			<button
				className={`pagination-nav ${
					disableNext ? '!bg-gray-500' : 'hover:bg-gray-800'
				}`}
				onClick={() => navButton('next')}
				disabled={disableNext}
			>
				Next
			</button>
		</div>
	);
}
