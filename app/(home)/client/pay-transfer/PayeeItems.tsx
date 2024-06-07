import { PayeeProps } from '@/lib/types';
import PayeeItem from './PayeeItem';
import { Types } from 'mongoose';

type Props = {
	payees: PayeeProps[];
	selectedId: Types.ObjectId | string;
	onSelect: (payee: PayeeProps)=> void;
};

export default function PayeeItems({ payees, selectedId, onSelect }: Props) {
	return (
		<div className='border p-3 rounded-lg'>
			{
				payees.length? payees.map((payee, idx) => (
					<PayeeItem
						key={idx}
						payee={payee}
						selectedId={selectedId}
						onSelect={onSelect}
					/>
				)):<span>No data.</span>
			}
		</div>
	);
}
