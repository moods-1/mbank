import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HeaderButtons() {
	return (
		<div className='flex gap-5'>
			<Button size={'sm'} className='bg-bank-green font-semibold flex-1'>
				<Link href='/auth/login'>Log In</Link>
			</Button>
			<Button
				size={'sm'}
				className='bg-white text-bank-green font-semibold flex-1 border border-green-700'
			>
				<Link href='/auth/sign-up'>Sign Up</Link>
			</Button>
		</div>
	);
}
