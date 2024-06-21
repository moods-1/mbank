import PersonalAccountsContent from './PersonalAccountsContent';
import MBankApp from './MBankApp';
import Legal from './Legal';

export default function PersonalAccounts() {
	return (
		<div>
			<div className='text-center font-medium mb-6'>
				<p>
					In addition to calling, did you know there are other quick and easy
					ways to contact us?
				</p>
				<p>{"Here's how you can do this:"}</p>
			</div>

			<div className='flex justify-center flex-wrap gap-6'>
				<PersonalAccountsContent />
				<MBankApp />
			</div>
			<Legal />
		</div>
	);
}
