'use client';
import { useState } from 'react';
export default function Legal() {
	const [showLegal, setShowLegal] = useState(false);
	return (
		<div className='w-full min-h-20 mt-12'>
			<p className='flex gap-3'>
				<span
					className='w-6 h-6 border-2 border-bank-green rounded-full flex items-center justify-center text-bank-green text-lg font-semibold cursor-pointer'
					onClick={() => setShowLegal((prev) => !prev)}
				>
					{showLegal ? '-' : '+'}
				</span>
				<span className='text-lg font-medium'>Legal</span>
			</p>

			{showLegal && <p className='text-center animate-fade text-sm font-medium mt-2'><span className='text-xs align-super'>1</span>The MBank app is free to download, however standard message and data rates may apply.</p>}
		</div>
	);
}
