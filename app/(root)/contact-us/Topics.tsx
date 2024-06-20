'use client';

import { ReactElement, ReactNode, useState } from 'react';

import SingleValueSelect from '@/components/SingleValueSelect';
import { CONTACT_US_SELECT_OPTIONS } from '@/lib/constants';
import TelephoneBanking from './TelephoneBanking';
import PersonalAccounts from './PersonalAccounts';
import MortgageSpecialist from './MortgageSpecialist';
import CreditCards from './CreditCards';

export default function Topics() {
	const [topic, setTopic] = useState('');
	const handleSelect = (e: string, field: string) => {
		setTopic(e);
    };
    let selectedTopic: ReactElement | ReactNode = <div />
    switch (topic) {
        case "MBank Telephone Banking":
            selectedTopic = <TelephoneBanking />;
            break;
        case "Personal Bank Accounts":
            selectedTopic = <PersonalAccounts />;
            break;
        case "Mortgage Specialist":
            selectedTopic = <MortgageSpecialist />;
            break;
        case "Credit Cards":
            selectedTopic = <CreditCards />;
            break;
        default:
            break;
    }
    
	return (
		<div className='w-full pb-10'>
			<div className='max-w-80 mx-auto mt-6 mb-14'>
				<SingleValueSelect
					reset=''
					name=''
					data={CONTACT_US_SELECT_OPTIONS}
					placeholder='Select a topic and call us'
					changeFunction={(e: string) => handleSelect(e, '')}
				/>
            </div>
            {selectedTopic}
		</div>
	);
}
