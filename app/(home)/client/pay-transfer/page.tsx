import { Metadata } from 'next';

import ClientContent from './ClientContent';

export const metadata: Metadata = {
	title: 'MBank - Pay & Transfer',
	description: 'Client section.',
};

export default function PayTransfer() {
	return (
		<main>
			<ClientContent />
		</main>
	);
}
