import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/lib/store/StoreProvider';
import { Mixpanel } from '@/components/Mixpanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'MBank',
	description: 'MBank online banking',
	icons: { icon: [{ url: '/images/logo.png' }] },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	Mixpanel.track('MBank financial app accessed.', {
		action: 'MBank financial app accessed.',
	});
	return (
		<html lang='en'>
			<body className={`${inter.className}`}>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
