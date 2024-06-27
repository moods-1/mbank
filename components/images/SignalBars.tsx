import { IoWifiSharp } from 'react-icons/io5';
import React from 'react';

type Props = {
	size?: string;
	className?: string;
};
export default function SignalBars({ size, className }: Props) {
	return <IoWifiSharp size={size || 'lg'} className={`${className}`} />;
}
