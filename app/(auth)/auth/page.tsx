'use client';
import { useRouter } from 'next/navigation';

import { updateClient } from '@/lib/store/userSlice';
import { ClientType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/store';

export default function Auth() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogin = () => {
		const now = new Date();
		const client: ClientType = {
			_id: '',
			firstName: 'Carl',
			lastName: 'Moods',
			loggedIn: true,
			email: '',
			password: '',
			phoneNumber: 0,
			image: '',
			createdAt: now,
			updatedAt: now,
			accounts: [],
		};
		dispatch(updateClient(client));
		router.push('/client');
	};

	return (
		<main>
			<section>
				<p className='page-title'>Auth</p>
				<Button onClick={handleLogin}>Login</Button>
			</section>
		</main>
	);
}
