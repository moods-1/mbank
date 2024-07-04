'use client';
import { useState, useEffect } from 'react';

import ProgressBar from '@/components/ProgressBar';
import { balanceCalculator } from '@/lib/clientFunctions';
import { useAppSelector } from '@/lib/store/store';

interface Props {
    id: string;
}

export default function PercentageDial({ id }: Props) {
    const [accountPercentage, setAccountPercentage] = useState(0);
    const { accounts } = useAppSelector((state) => state.client);
    
    useEffect(() => {
        const account = accounts.find(a => a._id === id);
        const totalBalance = balanceCalculator(accounts, 'credit');
        let accountPercentage: number = 0;
        if (account?.accountBalance) {
            accountPercentage = Math.round(
            (account.accountBalance / totalBalance) * 100
        );
        }
        setAccountPercentage(accountPercentage);
    },[accounts, id])

  return (
    <div className='flex-1 max-w-xl mx-auto'>
				<p className='text-lg sm:text-xl font-semibold text-center'>
					Percentage as part of all your accounts:
				</p>
				<div className='w-full flex justify-center mt-8 pb-4'>
					<ProgressBar
						className='w-32 sm:w-40 font-semibold'
						value={accountPercentage}
						strokeWidth={20}
						textColor='#000'
						textSize='22px'
						pathColor='#27c522'
						trailColor='#000'
					/>
				</div>
				<p></p>
			</div>
  )
}
