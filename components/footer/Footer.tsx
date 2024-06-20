import Link from 'next/link';
import Image from 'next/image';
import Socials from './Socials';
import Protection from './Protection';

export default function Footer() {
	return (
		<footer>
			<div className='w-full flex flex-wrap gap-10 justify-evenly my-10'>
				<Protection />
			</div>
			<div className='footer-content mt-10'>
				<div className='footer-content-box flex justify-center'>
					<a
						href='https://apps.apple.com/us'
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/apple-app.svg'
							alt='apple'
							width={140}
							height={50}
							className='border border-slate-600 rounded-md h-auto w-auto'
						/>
					</a>
				</div>
				<div className='footer-content-box flex justify-center'>
					<a
						href='https://play.google.com/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/google-app.svg'
							alt='apple'
							width={140}
							height={50}
							className='border border-slate-600 rounded-md h-auto w-auto'
						/>
					</a>
				</div>
			</div>
			<p className='text-center font-extralight'>
				Need to talk to us directly?{' '}
				<Link href={'/contact-us'} className='text-bank-green font-semibold'>
					Contact Us
				</Link>
			</p>
			<Socials />
			<p className='text-sm text-center'>MBank&copy; All Rights Reserved</p>
		</footer>
	);
}
