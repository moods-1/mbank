import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';
import React from 'react';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Global Mastercard'
				subtitle='No annual fee and great rewards.'
			/>
			<Construction className='max-w-sm'/>
		</main>
	);
}
