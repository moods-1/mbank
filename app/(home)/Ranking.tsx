import Image from 'next/image';

export default function Ranking() {
	return (
		<section className='bg-slate-500 bg-opacity-5 py-28'>
			<div className='flex justify-center flex-wrap gap-14'>
				<div className='max-w-lg'>
					<p className='text-3xl font-semibold'>
						{' '}
						MBank ranked #1 for customer satisfaction
					</p>
					<p>
						MBank has received the highest ranking for customer satisfaction
						among the Big 5 Retail Banks in the J.D. Power 2023 Canada Retail
						Banking Satisfaction Study.
					</p>
				</div>
				<div>
					<Image
						src='/images/jd-power.png'
						alt='jd-power'
						width={120}
						height={150}
						className='h-auto w-auto'
					/>
				</div>
			</div>
		</section>
	);
}
