import { PHONE_OPTIONS } from '@/lib/constants';

export default function TelephoneBanking() {
	return (
		<div className='max-w-xl mx-auto bg-green-50 mt-10 text-center'>
			{PHONE_OPTIONS.map(({ language, number, option }) => (
				<div key={language} className='flex justify-center max-w-xl'>
					<div className='flex-1 min-h-14 py-4 border'>{language}</div>
					<div className='flex-1 min-h-14 py-4 border'>
						<p>{number}</p>
						{option && <p>{option}</p>}
					</div>
				</div>
			))}
		</div>
	);
}
