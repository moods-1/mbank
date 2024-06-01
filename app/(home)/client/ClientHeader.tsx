'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CLIENT_HEADER_LINKS } from '@/lib/constants';

export default function ClientHeader() {
	const [tabIndex, setTabIndex] = useState(0);
	const currentPath = usePathname();

  useEffect(() => {
    let idx: number = 0;
    if (currentPath.includes('pay-transfer')) {
      idx = 1;
    }
    setTabIndex(idx);
  }, [currentPath])
  
	return (
		<nav className='flex px-0 sm:px-10 border-b-4'>
			{CLIENT_HEADER_LINKS.map(({ title, link }, idx) => (
				<Link
					key={title}
					href={link}
					className={`h-full -mb-1 border-b-4 border-transparent py-2 px-3 ${
						idx === tabIndex ? 'active-tab' : ''
					}`}
				>
					{title}
				</Link>
			))}
		</nav>
	);
}
