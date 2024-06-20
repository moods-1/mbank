import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { CONTACT_PERSONAL_ACCOUNTS } from '@/lib/constants';

export default function PersonalAccountsContent() {
    const { points, text, button1Text } = CONTACT_PERSONAL_ACCOUNTS;
	return (
		<div className='max-w-72 p-5 text-[15px] font-medium bg-green-50 bg-opacity-90'>
            <p className='text-center text-lg mb-6'>Personal Accounts</p>
            <div className='w-32 h-28 mx-auto'>
              <Image src='/images/desktop-app.png' alt='web-app' width={1000} height={1000} />
          </div>
			<ol className='list-decimal text-left mb-6 pl-5'>
				{points.map((value, idx) => (
					<li key={idx} className='mb-2'>{value}</li>
				))}
			</ol>
			<p>{text}</p>
			<div className='text-center'>
				{/* mx-auto was not woring on the button */}
				<Button size={"sm"} className='w-fit bg-bank-green hover:bg-green-800 my-6'>
					<Link href='/login'>{button1Text}</Link>
				</Button>
			</div>
		</div>
	);
}

