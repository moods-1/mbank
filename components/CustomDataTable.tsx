import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { TableRowLoader } from './Loaders';

type TablePropsType = {
	rows: any[] | undefined;
	columns: any[];
	filterable?: boolean;
	dataFilter?: string;
	tableHeight?: number;
	isLoading: boolean;
	emptyMessage?: ReactElement | ReactNode;
};

function CustomDataTable({
	rows,
	columns,
	filterable,
	dataFilter,
	tableHeight,
	isLoading,
	emptyMessage,
}: TablePropsType) {
	const [filterableIndexes, setFilterableIndexes] = useState<any[]>([]);
	const filteredData = rows?.filter((row) => {
		let value;
		let match = false;
		if (dataFilter) {
			for (let x of filterableIndexes) {
				if (String(row[x])?.toLowerCase().includes(dataFilter)) {
					match = true;
					break;
				}
			}
			if (match) {
				value = row;
			}
		} else {
			value = rows;
		}
		return value;
	});

	useEffect(() => {
		if (filterable) {
			let filterableArray: any[] = [];
			columns.forEach(
				(col) => col.filterable && filterableArray.push(col.field)
			);
			setFilterableIndexes(filterableArray);
		}
	}, [columns, filterable]);

	const main = {
		maxHeight: tableHeight || 200,
	};
	const CaptionMessage = () => {
		return emptyMessage ? (
			emptyMessage
		) : (
			<div className='caption-message'>
				<h3>{"It's Empty"}</h3>
				<p>
					Hmm... looks like there is no <br /> data to display.
				</p>
			</div>
		);
	};

	const showCaption = !filteredData?.length && !isLoading;

	return (
		<div className='table-div' style={main}>
			<table className='table'>
				<thead>
					<tr>
						{columns.map(({ label }) => (
							<td key={label}>{label}</td>
						))}
					</tr>
				</thead>
				{showCaption && (
					<caption className='empty-caption'>
						<CaptionMessage />
					</caption>
				)}
				<tbody>
					{filteredData?.map((row, index) => (
						<tr key={index}>
							{columns.map(({ field }, index) => (
								<td key={field}>{row[field]}</td>
							))}
						</tr>
					))}
					{isLoading && (
						<TableRowLoader columns={columns} className='h-6' quantity={2} />
					)}
				</tbody>
			</table>
		</div>
	);
}

export default CustomDataTable;
