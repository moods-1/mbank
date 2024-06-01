// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

// import { useAppSelector } from '@/lib/store/store';
import ClientHeader from './ClientHeader';
import { getLoggedIn } from '@/lib/clientFunctions';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const { loggedIn } = useAppSelector((state) => state.client);
	// const router = useRouter();

	// useEffect(() => {
	// 	// Push inside here prevents "ReferenceError: location is not defined"
	// 	if (!loggedIn) {
	// 		router.push('/');
	// 	}
	// }, [loggedIn, router]);

	if (!getLoggedIn()) {
		if (typeof document !== 'undefined') {
			const link = document.createElement('a');
			link.href = '/';
			link.click();
			link.remove();
		}
	}

	return (
		<main className='pt-3'>
			<ClientHeader />
			<div className='client-section'>{children}</div>
		</main>
	);
}
