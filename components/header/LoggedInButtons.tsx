import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { logoutClient } from '@/lib/store/clientSlice';
import { useAppDispatch } from '@/lib/store/store';

type Props = {
	changeFunction?: () => void;
	height?: string;
};

export default function LoggedInButtons({ changeFunction, height }: Props) {
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
				className={`${height? height: 'h-[30px]'} menu-button bg-bank-green rounded-sm text-white green-button`}
				onClick={handleLogout}
				size='sm'
			>
				Logout
			</Button>
			{hideMyAccount ? null : (
				<Button
					size='sm'
					className={`${height? height: 'h-[30px]'} menu-button bg-white text-bank-green rounded-sm border border-green-700 w-auto`}
					onClick={handleMobile}
				>
					My Accounts
				</Button>
			)}
		</div>
	);
}
