import { ReactElement, ReactNode } from 'react';

import {
	Dialog,
	DialogContent,
} from '@/components/ui/dialog';

type Props = {
    content: ReactElement | ReactNode;
	className?: string;
	open: boolean;
	openChange: (open: boolean) => void;
};

export default function GeneralModal({
    content,
    className,
	open,
	openChange,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={openChange}>
			<DialogContent className={`notification-dialog ${className}`}>
                { content}
			</DialogContent>
		</Dialog>
	);
}
