import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';
import React from 'react';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Home Equity Line of Credit'
				subtitle='Friendship rates for you.'
			/>
			<Construction className='max-w-sm' />
		</main>
	);
}
