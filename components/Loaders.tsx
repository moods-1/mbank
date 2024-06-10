import React from 'react';

type LoaderProps = {
	borderSize: string;
	size: string;
	color: string;
};

export const Loader = (props: LoaderProps) => {
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

type TableHeaderType = {
	label: string;
	field: string;
	filterable: boolean;
};

type TableRowLoaderType = {
	columns: TableHeaderType[];
	className?: string;
};

export function TableRowLoader({ columns, className }: TableRowLoaderType) {
	return (
		<tr>
			{columns.map(({ field }) => (
				<td
					key={field + Math.random() * 1000}
					// className={`side-loader inline-block h-10`}
				>
					<span className={`side-loader inline-block ${className || 'h-10'}`} />
				</td>
			))}
		</tr>
	);
}
