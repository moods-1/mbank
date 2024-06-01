import Image from 'next/image';

export default function AppDevices() {
	return (
		<section>
			<div className='flex flex-wrap gap-5 justify-center'>
				<div className='flex-1 min-w-56'>
					<div className='flex flex-col justify-center max-w-[600px] text-center'>
						<p className='text-xl sm:text-3xl font-semibold max-w-[460px] mb-4 mx-auto'>
							Get our award-winning mobile banking app
						</p>
						<p className='font-light max-w-[600px]'>{`Our app ranked #1 number one in Canada for digital money management. Enjoy 20+ twenty plusfeatures – from spending insights to global transfers.`}</p>
						<div className='flex flex-wrap justify-center gap-5 mt-10'>
							<a
								href='https://apps.apple.com/us'
								target='_blank'
								rel='noopener noreferrer'
							>
								<Image
									src='/images/apple-app.svg'
									alt='apple'
									width={160}
									height={50}
									className='rounded-lg h-auto w-auto bg-black'
								/>
							</a>
							<a
								href='https://play.google.com/'
								target='_blank'
								rel='noopener noreferrer'
							>
								<Image
									src='/images/google-app.svg'
									alt='apple'
									width={160}
									height={50}
									className='rounded-lg h-auto w-auto bg-black'
								/>
							</a>
						</div>
					</div>
				</div>
				<div className='flex-1 min-w-56'>
					<Image
						src='/images/app-devices.png'
						width={400}
						height={500}
						alt='devices'
						className='mx-auto'
					/>
				</div>
			</div>
		</section>
	);
}
