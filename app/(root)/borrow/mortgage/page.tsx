import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';
import React from 'react';

export default function page() {
	return (
		<main>
			<PageHeader
				title=' Mortgage'
				subtitle='Rates to help you own your home faster.'
			/>
			<Construction className='max-w-sm'/>
		</main>
	);
}
