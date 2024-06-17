import Link from 'next/link';

import { Button } from '@/components/ui/button';
import CreditCard from '@/components/CreditCard';

export default function Hero() {
	return (
		<div className='hero bg-hero bg-cover'>
			<div className='flex items-center justify-center text-black hero-segment p-6'>
				<div className='max-w-xl'>
					<p className='text-3xl sm:text-5xl font-semibold text-shadow mb-5'>
						Empower Your Future with Secure Banking
					</p>
					<p className='text-lg font-medium text-white'>
						Join millions who trust us with their financial journey.
					</p>
					<Link href='/sign-up'>
						<Button className='bg-black text-white rounded-full mt-8'>
							Open an Account
						</Button>
					</Link>
				</div>
			</div>
			<div className='hero-segment hidden md:flex items-center justify-center'>
				<CreditCard />
			</div>
		</div>
	);
}
