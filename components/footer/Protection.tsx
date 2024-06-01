import Image from 'next/image';

import { PROTECTION_DATA } from '@/lib/constants';

export default function Protection() {
	return (
		<div className='w-full flex flex-wrap gap-10 justify-evenly my-10'>
			{PROTECTION_DATA.map(({ alt, image1, image2, link, text }) => (
				<div
					key={alt}
					className='footer-content-box flex flex-col items-center text-center'
				>
					<a
						href={link}
						target='_blank'
						rel='noopener noreferrer'
						className='h-auto min-h-24 pb-5 sm:pb-0'
					>
						<span className='flex justify-center min-h-[52px] gap-6 flex-wrap'>
							<Image
								src={image1}
								width={alt === 'ciro' ? 160 : 120}
								height={100}
								alt={alt}
								className='h-auto rounded-lg'
							/>
							{image2 ? (
								<Image
									src={image2}
									width={120}
									height={100}
									alt={alt}
									className='h-auto'
								/>
							) : null}
						</span>
					</a>
					<p className='text-sm'>{text}</p>
				</div>
			))}
		</div>
	);
}
