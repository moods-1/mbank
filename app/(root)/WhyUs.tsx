'use client';

import { CUSTOMERS_LOVE } from '@/lib/constants';
import { fadeIn } from '@/lib/motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function WhyUs() {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		amount: 'some',
	});

	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			//start animation
			mainControls.start('visible');
		}
	});

	return (
		<section>
			<div className='w-full min-h-96 text-black text-center'>
				<p className='page-title text-center text-bank-green'>Why choose us?</p>
				<p className='-mt-10 text-lg'>
					Here are just a few customer favourites.
				</p>
				<div
					ref={ref}
					className='flex flex-wrap gap-14 items-center justify-around mt-20 overflow-hidden p-2'
				>
					{CUSTOMERS_LOVE.map(({ title, body, image }, index) => (
						<motion.div
							variants={fadeIn(index * 0.4, 0.75)}
							initial='hidden'
							animate={mainControls}
							key={title}
							className='w-80 min-h-72 text-black rounded-sm text-center overflow-hidden'
						>
							<Image
								src={image}
								width={400}
								height={300}
								alt={title}
								className='rounded-sm'
								priority
							/>
							<div className='p-2 min-h-44'>
								<p className='text-2xl font-semibold mb-5'>{title}</p>
								<p className='font-light w-full'>{body}</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
