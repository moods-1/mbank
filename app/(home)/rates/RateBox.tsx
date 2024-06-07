'use client';

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';

import { fadeIn } from '@/lib/motion';
import Link from 'next/link';

type DataObject = {
	label: string;
	rate: string;
	link: string;
};

type Props = {
	title: string;
	subtitle: string;
	data: DataObject[];
};

export default function RateBox({ title, subtitle, data }: Props) {
	const [showDrop, setShowDrop] = useState(false);
	const animationControls = useAnimation();

	const handleDropControl = (e: React.MouseEvent<HTMLDivElement>) => {
		const show = !showDrop;
		setShowDrop((prev) => !prev);
		animationControls.start(show ? 'visible' : '');
	};

	return (
		<div className='card max-w-lg mx-auto mb-6 border'>
			<div role='button' className='rate-control' onClick={handleDropControl}>
				<p className='text-lg sm:text-2xl font-semibold'>{title}</p>
				<p>{subtitle}</p>
				<span className='flex justify-end'>
					<button className='h-8 w-8 rounded-full flex-center-row'>
						<FaChevronDown
							role='button'
							aria-expanded={showDrop}
							className='text-bank-green'
						/>
					</button>
				</span>
			</div>
			<div
				className={`${
					showDrop ? 'h-auto pt-4 opacity-100' : 'h-0 opacity-0'
				} overflow-hidden`}
			>
				{data.map(({ label, rate, link }, idx) => (
					<motion.p
						variants={fadeIn(idx * 0.1, 0.5)}
						initial='hidden'
						animate={animationControls}
						key={label}
						className='text-sm sm:text-base text-center flex flex-col items-center sm:flex-row sm:justify-between py-2 sm:gap-4 border-b sm:border-0'
					>
						<Link href={link} className='font-semibold hover:text-bank-green hover:pl-2 hover-slide'>
							{label}
						</Link>

						<span>{rate}</span>
					</motion.p>
				))}
			</div>
		</div>
	);
}
