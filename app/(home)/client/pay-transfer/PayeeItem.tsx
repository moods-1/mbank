import { PayeeProps } from '@/lib/types';
import { Check } from 'lucide-react';
import { Types } from 'mongoose';
import { FaCheck } from 'react-icons/fa6';

type ItemProps = {
	payee: PayeeProps;
	selectedId: Types.ObjectId | string;
	onSelect: (payee: PayeeProps)=> void;
};
export default function PayeeItem({ payee, selectedId, onSelect }: ItemProps) {
	const { payeeName, accountNumber, _id } = payee;
	const selected = selectedId === _id;
	return (
		<div
			className={`payee-item ${selected ? 'bg-gray-100' : ''}`}
			onClick={() => onSelect(payee)}
		>
			<div className='flex items-center w-6'>
				{selected ? <FaCheck className='text-bank-green' /> : null}
			</div>
			<div>
				<p>{payeeName}</p>
				<p>{accountNumber}</p>
			</div>
		</div>
	);
}
