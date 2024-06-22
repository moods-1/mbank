import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface Props {
	height?: string;
}

export default function LoggedOutButtons({ height }: Props) {
	return (
		<div className='flex gap-5'>
			<Button
				size='sm'
				className={`${
					height ? height : 'h-[30px]'
				} menu-button green-button bg-bank-green`}
			>
				<Link href='/login'>Log In</Link>
			</Button>
			<Button
				size='sm'
				className={`${
					height ? height : 'h-[30px]'
				} menu-button bg-white text-bank-green border border-green-700`}
			>
				<Link href='/sign-up'>Sign Up</Link>
			</Button>
		</div>
	);
}
