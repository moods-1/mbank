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
		} else if (currentPath.includes('admin')) {
			idx = 2;
		}
		setTabIndex(idx);
	}, [currentPath]);

	return (
		<nav className='flex px-1 sm:px-10 bg-black text-white gap-3 pb-1 text-sm'>
			{CLIENT_HEADER_LINKS.map(({ title, link }, idx) => (
				<Link
					key={title}
					href={link}
					className={`h-full border-b-[3px] border-transparent py-1 ${
						idx === tabIndex ? 'active-tab' : ''
					}`}
				>
					{title}
				</Link>
			))}
		</nav>
	);
}
