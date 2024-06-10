'use client';

import { useAppSelector } from '@/lib/store/store';
import AddPayee from './AddPayee';
import MakePayment from './MakePayment';
import QuickTransfer from './QuickTransfer';

export default function ClientContent() {
	const { client, accounts } = useAppSelector((state) => state.client);

	return (
		<div>
			<div className=' w-full flex items-center flex-col-reverse sm:flex-row justify-between flex-wrap gap-5'>
				<AddPayee client={client} />
				<QuickTransfer />
			</div>
			<MakePayment client={client} accounts={accounts} />
		</div>
	);
}
