import React from 'react';

type Props = {
	borderSize: string;
	size: string;
	color: string;
};

export const Loader = (props: Props) => {
	const { borderSize, size, color } = props;
	const spinnerSize = size || '35px';
	const spinnerColor = color || '#0275d8';
	const spinnerBorderSize = borderSize || '5px';

	const style = {
		width: spinnerSize,
		height: spinnerSize,
		border: `${spinnerBorderSize} solid #ddd`,
		borderRadius: '50%',
		borderTop: `${spinnerBorderSize} solid ${spinnerColor}`,
	};

	return <div className={`spinner`} style={style} />;
};

export function SlideLoader({ className }: { className?: string | undefined }) {
	return <span className={`side-loader inline-block ${className || 'h-10'}`} />;
}

export function PlantLoader({ count }: { count: number }) {
	const countArr = [];
	const maxNum = count || 1;
	for (let i = 0; i < maxNum; i++) {
		countArr.push(i);
	}
	return (
		<>
			{countArr.map((_, idx) => (
				<div
					className={`w-full max-w-72 h-96 ${idx > 0 ? 'hidden sm:block' : ''}`}
					key={idx}
				>
					<SlideLoader className='!h-full' />
				</div>
			))}
		</>
	);
}
