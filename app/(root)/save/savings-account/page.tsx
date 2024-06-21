import Construction from '@/components/Construction';
import PageHeader from '@/components/PageHeader';

export default function SavingsAccount() {
	return (
		<main>
			<PageHeader
				title='Savings'
				subtitle='Earn a great interest rate on your Savings Account.'
			/>
			<Construction className='max-w-sm'/>
		</main>
	);
}
