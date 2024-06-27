import { Button } from '@/components/ui/button';
import { CONTACT_MBANK_APP } from '@/lib/constants';
import Image from 'next/image';

export default function MBankApp() {
	const { points, text, text2, button1Text, button2Text } = CONTACT_MBANK_APP;
	return (
		<div className='max-w-72 p-5 text-[15px] font-medium bg-green-50 bg-opacity-90'>
			<p className='text-center text-lg mb-6'><span className='text-xs align-super'>1</span>MBank App</p>
			<div className='w-10 h-28 mx-auto'>
				<Image
					src='/images/phone-app.png'
					alt='phone-app'
					width={1000}
					height={1000}
				/>
			</div>
			<ol className='list-decimal text-left mb-6 pl-5'>
				{points.map((value, idx) => (
					<li key={idx} className='mb-2'>
						{value}
					</li>
				))}
			</ol>
			<p>{text}</p>
			<br />
			<p>{text2}</p>
			<div className='flex flex-col items-center justify-center gap-6 pt-6'>
				{/* mx-auto was not woring on the button */}
				<Button size={"sm"} className='min-w-28 bg-bank-green hover:bg-green-800'>
					{button1Text}
				</Button>
				<Button size={"sm"} className='min-w-28 bg-bank-green hover:bg-green-800'>
					{button2Text}
				</Button>
			</div>
		</div>
	);
}
