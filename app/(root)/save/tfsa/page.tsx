import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';
import React from 'react';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Tax-Free Savings Account'
				subtitle='Only your hands in you pocket.'
			/>
			<Construction className='max-w-sm'/>
		</main>
	);
}
