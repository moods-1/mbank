import Link from 'next/link';

import Topics from './Topics';

export default function MainContent() {
	return (
		<section className='py-8'>
			<div className='w-full text-center'>
				<p className='text-bank-green text-2xl font-semibold mb-8'>
					Contact Us
				</p>
				<p className='mb-8'>
					Looking for help with activities like logging in, setting up a direct
					deposit, or replacing a lost/damaged card?{' '}
					<Link className='text-green-600' href='#'>
						Visit our Help Centre.
					</Link>
				</p>
				<p className='text-lg font-semibold'>
					{"Let's find the right person for you to talk to"}
				</p>
			</div>
			<Topics />
		</section>
	);
}
