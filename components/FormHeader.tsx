import { ReactElement, ReactNode } from 'react';

type Props = {
	children: ReactElement | ReactNode;
	className?: string;
};
export default function FormHeader({ children, className }: Props) {
	return <div className={`form-header ${className}`}>{children}</div>;
}
