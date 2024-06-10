'use client';

import { useEffect, useState } from 'react';
import { Types } from 'mongoose';

import { PayeeProps } from '@/lib/types';
import PayeeItem from './PayeeItem';
import { SlideLoader } from '@/components/Loaders';

type Props = {
	payees: PayeeProps[];
	selectedId: Types.ObjectId | string;
	onSelect: (payee: PayeeProps) => void;
};

export default function PayeeItems({ selectedId, payees, onSelect }: Props) {
	const [localPayees, setLocalPayees] = useState<PayeeProps[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (payees.length) {
			setLocalPayees(payees);
			setIsLoading(false);
		}
	}, [payees]);

	return (
		<div className='border p-3 rounded-lg'>
			{isLoading ? (
				<div>
					<SlideLoader />
					<SlideLoader />
				</div>
			) : (
				localPayees.map((payee, idx) => (
					<PayeeItem
						key={idx}
						payee={payee}
						selectedId={selectedId}
						onSelect={onSelect}
					/>
				))
			)}
		</div>
	);
}
