import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { logoutClient } from '@/lib/store/clientSlice';
import { useAppDispatch } from '@/lib/store/store';

type Props = {
	changeFunction?: () => void;
};

export default function LoggedInButtons({ changeFunction }: Props) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const currentPath = usePathname();
	const hideMyAccount = currentPath.includes('/client');

	const handleLogout = () => {
		dispatch(logoutClient());
		if (changeFunction) {
			changeFunction();
		}
		router.push('/');
	};

	const handleMobile = () => {
		if (changeFunction) {
			changeFunction();
		}
		router.push('/client');
	};

	return (
		<div className='flex gap-5 w-auto'>
			<Button
				className='bg-bank-green h-8 flex-1 rounded-sm text-white'
				onClick={handleLogout}
				size='sm'
			>
				Logout
			</Button>
			{hideMyAccount ? null : (
				<Button
					size='sm'
					className='bg-white h-8 text-bank-green rounded-sm flex-1 border border-green-700 w-auto'
					onClick={handleMobile}
				>
					My Accounts
				</Button>
			)}
		</div>
	);
}
