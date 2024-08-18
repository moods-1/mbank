'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { logoutClient } from '@/lib/store/clientSlice';
import { useAppSelector } from '@/lib/store/store';
import { useAppDispatch } from '@/lib/store/store';
import AddPayee from './AddPayee';
import MakePayment from './MakePayment';
import QuickTransfer from './QuickTransfer';
import PageHeader from '@/components/PageHeader';
import { getToken } from '@/lib/clientFunctions';
import { tokenCheck } from '@/appInterface/actions/clientActions';
import { SlideLoader } from '@/components/Loaders';

export default function ClientContent() {
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { client, accounts, loggedIn } = useAppSelector(
		(state) => state.client
	);

	useEffect(() => {
		const verifyToken = async () => {
			const token: string = await getToken();
			const goodToken = await tokenCheck(token);
			if (!goodToken) {
				dispatch(logoutClient());
				router.push('/');
			} else {
				setIsLoading(false);
			}
		};
		verifyToken();
		return () => {};
	}, [dispatch, loggedIn, router]);

	return (
		<div>
			<PageHeader title='Pay and Transfer' className='pl-0 !py-0' />
			{isLoading ? (
				<SlideLoader className='mt-10 h-20'/>
			) : (
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
			)}
		</div>
	);
}
