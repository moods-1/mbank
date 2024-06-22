import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'MBank - Auth',
	description: 'MBank online banking',
	icons: { icon: [{ url: '/images/logo.png' }] },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className={`bg-auth bg-no-repeat`}>
			<div className='px-6 sm:px-10 text-center py-8'>
				<p className='text-3xl sm:text-5xl mb-2 font-semibold text-bank-green'>
					MBank
				</p>
				<p className='text-xl text-white'>Online banking of the future.</p>
			</div>
			{children}
		</main>
	);
}
