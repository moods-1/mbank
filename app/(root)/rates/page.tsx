import { RATES } from '@/lib/constants';
import RateBox from './RateBox';
import PageHeader from '@/components/PageHeader';

export default function page() {
	return (
		<main>
			<PageHeader
				title='Rates'
				subtitle='A full listing of current MBank rates.'
			/>
			<div className='flex items-center justify-between flex-wrap min-h-14 bg-green-100 min-w-full px-6 sm:px-10 py-2'>
				<span className=' font-semibold sm:text-xl'>
					{'MBank Prime Rate: 7.20%'}
				</span>
				<span>{'Effective February 06, 2024'}</span>
			</div>
			<section>
				{Object.entries(RATES).map(([key, value], idx) => (
					<RateBox
						key={idx}
						title={key}
						data={value.data}
						subtitle={value.subtitle}
					/>
				))}
			</section>
		</main>
	);
}
