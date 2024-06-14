import { ChangeEvent, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { FaTrash } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineSearch, MdOutlineRestoreFromTrash } from 'react-icons/md';
import { Input } from '@/components/ui/input';

type Props = {
	placeholder: string;
	className?: string;
	changeFunction: (value: string) => void;
};

export default function SearchInput({
	placeholder,
	changeFunction,
	className,
}: Props) {
	const [localSearch, setLocalSearch] = useState('');

	const clearSearch = () => {
		setLocalSearch('');
		changeFunction('');
	};

	return (
		<div className={`search-input w-full ${className}`}>
			<Input
				type='text'
				className='no-focus focus:border-gray-400'
				placeholder={placeholder || 'Search'}
				value={localSearch}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setLocalSearch(e.target.value);
					changeFunction(e.target.value.toLowerCase());
				}}
			/>
			{localSearch ? (
				<MdOutlineRestoreFromTrash
					className='search-input-icon search-input-cancel'
					onClick={clearSearch}
				/>
			) : (
				<MdOutlineSearch className='search-input-icon' />
			)}
		</div>
	);
}
