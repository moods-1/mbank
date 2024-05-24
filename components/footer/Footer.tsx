import Link from 'next/link';
import Image from 'next/image';
import Socials from './Socials';

export default function Footer() {
	return (
		<footer>
			<div className='footer-content'>
				<div className='footer-content-box'>
					<p className='text-2xl font-semibold text-bank-green'>
						<Link href='/'> MBank</Link>
					</p>
					<div className='text-sm mt-2'>
						<p>1-888-88MBANK</p>
						<p>1 MBank Avenue, ON, Canada</p>
					</div>
				</div>
				<div className='footer-content-box flex flex-col items-center text-center'>
					<a href='https://www.cdic.ca/' target='_blank' rel='noopener noreferrer' className='h-24'>
						<Image src='/images/cdic.svg' width={160} height={100} alt='cidc' />
					</a>

					<p>
						Your deposits may be insurable by the Canada Deposit Insurance
						Corporation.
					</p>
				</div>
				<div className='footer-content-box flex flex-col items-center text-center'>
					<a href='https://www.ciro.ca/' target='_blank' rel='noopener noreferrer' className='h-24'>
						<Image
							src='/images/ciro-white.png'
							width={160}
							height={100}
							alt='cidc'
						/>
					</a>
					<p>
						CIRO regulation applies to MBank Investment Services Inc., a separate
						company from and a wholly-owned subsidiary of MBank.
					</p>
				</div>
			</div>
			<Socials />
			<p className='text-sm text-center'>MBank&copy; All Rights Reserved</p>
		</footer>
	);
}
