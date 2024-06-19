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
			<div className='footer-content mt-20'>
				<div className='footer-content-box'>
					<p className='text-2xl font-semibold text-bank-green'>
						<Link href='/'> MBank</Link>
					</p>
					<div className='text-sm mt-2'>
						<p>1-888-88MBANK</p>
						<p>1 MBank Avenue, ON, Canada</p>
					</div>
				</div>
				<div className='footer-content-box'>
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
				<div className='footer-content-box'>
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
			<Socials />
			<p className='text-sm text-center'>MBank&copy; All Rights Reserved</p>
		</footer>
	);
}
