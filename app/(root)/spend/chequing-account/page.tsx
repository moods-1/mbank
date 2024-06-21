import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';
import React from 'react';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Chequing Account'
				subtitle='No fees charged to spend with us.'
			/>
			<Construction className='max-w-sm'/>
		</main>
	);
}
