import { ReactElement } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '../ui/button';

type Props = {
	icon: ReactElement;
	title: string;
	body: string;
	buttonText: string;
	buttonFunction: (e: React.MouseEvent<HTMLButtonElement>) => void;
	buttonClass?: string;
	className?: string;
	open: boolean;
	openChange: (open: boolean) => void | (() => void);
};

export default function NotificationModal({
	icon,
	title,
	body,
	buttonText,
	buttonFunction,
	buttonClass,
	className,
	open,
	openChange,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={openChange}>
			<DialogContent className={`notification-dialog ${className}`}>
				{icon}
				<DialogTitle className='font-semibold text-lg sm:text-2xl'>{title}</DialogTitle>
				<DialogDescription className='text-black text-[15px]'>{body}</DialogDescription>
				<Button className={`no-focus ${buttonClass}`} onClick={buttonFunction}>
					{buttonText}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
