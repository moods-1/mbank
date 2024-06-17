import type { Metadata } from 'next';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export const metadata: Metadata = {
	title: 'MBank',
	description: 'MBank online banking.',
	icons: { icon: [{ url: '/images/logo.png' }] },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<Header />
			{children}
			<Footer />
		</main>
	);
}
