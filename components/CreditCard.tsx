import React from 'react';
import Image from 'next/image';

import SignalBars from '@/components/images/SignalBars';

export default function CreditCard({ background }: { background?: string }) {
	return (
		<div
			className={`${background || 'glass'} w-72 h-44 rounded-lg p-5 text-white`}
		>
			<p className='flex justify-between mb-10 font-medium'>
				<span className='text-xl'>MBank</span>
				<SignalBars className='rotate-90 w-6' />
			</p>
			<p className='flex justify-between card-numbers'>
				<span>1234</span>
				<span>5678</span>
				<span> 8888</span>
				<span>4321</span>
			</p>
			<p className='uppercase'>James Jones</p>
			<p className='flex items-center justify-between'>
				<span>02/27</span>
				<Image
					src='/images/MasterCard-sm.png'
					alt='mc'
					width={50}
					height={50}
				/>
			</p>
		</div>
	);
}
