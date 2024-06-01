import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ReactElement, SetStateAction } from 'react';
import { Button } from '../ui/button';

type Props = {
	icon: ReactElement;
	title: string;
	body: string;
	buttonText: string;
	buttonFunction: (e: React.MouseEvent<HTMLButtonElement>) => void;
	buttonClass?: string;
	open: boolean;
	openChange: (open: boolean) => void;
};

export default function NotificationModal({
	icon,
	title,
	body,
	buttonText,
	buttonFunction,
	buttonClass,
	open,
	openChange,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={openChange}>
			<DialogContent className='notification-dialog'>
				{icon}
				<p className='font-semibold text-lg sm:text-2xl'>{title}</p>
				<p>{body}</p>
				<Button className={`no-focus ${buttonClass}`} onClick={buttonFunction}>
					{buttonText}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
