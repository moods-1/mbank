import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Retirement Savings Account'
				subtitle='Do a whole lot of nothing sooner!'
			/>
			<Construction className='max-w-sm' />
		</main>
	);
}
