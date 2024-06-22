import type { Metadata } from 'next';

import ClientHeader from './ClientHeader';
import { getLoggedIn } from '@/lib/clientFunctions';

export const metadata: Metadata = {
	title: 'MBank - Accounts',
	description: 'MBank client section.',
	icons: { icon: [{ url: '/images/logo.png' }] },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	if (!getLoggedIn()) {
		if (typeof document !== 'undefined') {
			const link = document.createElement('a');
			link.href = '/';
			link.click();
			link.remove();
		}
	}

	return (
		<main>
			<ClientHeader />
			<div className='client-section'>{children}</div>
		</main>
	);
}
