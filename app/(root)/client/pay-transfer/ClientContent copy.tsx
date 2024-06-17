'use client';

import { useAppSelector } from '@/lib/store/store';
import AddPayee from './AddPayee';
import MakePayment from './MakePayment';
import QuickTransfer from './QuickTransfer';
import PageHeader from '@/components/PageHeader';

export default function ClientContent() {
	const { client, accounts } = useAppSelector((state) => state.client);

	return (
		<div>
			<PageHeader title='Pay and Transfer' className='pl-0 !py-0' />
			<div className=' w-full flex items-center flex-col-reverse sm:flex-row justify-between flex-wrap gap-5 mt-10'>
				<QuickTransfer />
				<AddPayee client={client} />
			</div>
			<MakePayment client={client} accounts={accounts} />
		</div>
	);
}
