import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../globals.css';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import StoreProvider from '../StoreProvider';

const inter = Inter({ subsets: ['latin'] });

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
		<html lang='en'>
			<body className={inter.className}>
				<StoreProvider>
					<Header />
					{children}
					<Footer />
				</StoreProvider>
			</body>
		</html>
	);
}
