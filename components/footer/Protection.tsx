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
						<span className='flex justify-center w-28 h-10 sm:w-44 sm:h-14 gap-6 flex-wrap'>
							<Image
								src={image1}
								width={1000}
								height={1000}
								alt={alt}
								className='w-full rounded-md'
							/>
						</span>
					</a>
					<p className='text-sm'>{text}</p>
				</div>
			))}
		</div>
	);
}
