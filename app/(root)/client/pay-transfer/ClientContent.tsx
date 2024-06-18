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
			<div className='flex flex-wrap flex-col md:flex-row gap-8 mt-10'>
				<div className='flex-1 w-full flex items-start flex-wrap justify-center gap-10'>
					<div className='flex flex-wrap justify-center gap-8'>
						<QuickTransfer />
						<AddPayee client={client} />
					</div>
				</div>
				<div className='flex-1 flex justify-center'>
					<MakePayment client={client} accounts={accounts} />
				</div>
			</div>
		</div>
	);
}
