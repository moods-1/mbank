import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type Props = {
	className?: string;
	value: number;
	strokeWidth?: number;
	text?: string;
	textColor?: string;
	textSize?: string;
	pathColor?: string;
	trailColor?: string;
};

export default function ProgressBar({
	className,
	value,
	strokeWidth,
	text,
	textColor,
	textSize,
	pathColor,
	trailColor,
}: Props) {
	const duration = value > 50 ? 3 : 1;
	return (
		<div className={`${className}`}>
			<CircularProgressbar
				value={value}
				text={`${text ? text : value + '%'}`}
				strokeWidth={strokeWidth || 8}
				styles={buildStyles({
					strokeLinecap: 'butt',
					pathTransitionDuration: duration,
					pathColor: pathColor || '#227ec5',
					trailColor: trailColor || '#aaa',
					textColor: textColor || '#000',
					textSize: textSize || '16px',
				})}
			/>
		</div>
	);
}
