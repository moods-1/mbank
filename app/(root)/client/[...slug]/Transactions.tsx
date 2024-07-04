import CustomDataTable from '@/components/CustomDataTable';
import Pagination from '@/components/Pagination';
import { TRANSACTION_HEADERS } from '@/lib/constants';

interface Props {
	rows: any[];
	isLoading: boolean;
	loaderRows: number;
	hasMore: boolean;
	totalPages: number;
	dataFilter: string;
	handlePage: (paginationNumber: number) => void;
	reset: boolean;
}

export default function Transactions({
	rows,
	isLoading,
	loaderRows,
	hasMore,
	totalPages,
	dataFilter,
	handlePage,
	reset,
}: Props) {
	const emptyMessage = () => {
		return (
			<div className='caption-message text-center'>
				<p> No transactions.</p>
			</div>
		);
	};

	return (
		<>
			<div className='hidden sm:block w-full min-h-[485px] pt-0'>
				<CustomDataTable
					rows={rows}
					isLoading={isLoading}
					columns={TRANSACTION_HEADERS}
					tableHeight={800}
					emptyMessage={emptyMessage()}
					dataFilter={dataFilter}
					filterable
					loaderRows={loaderRows || 5}
				/>
			</div>
			{totalPages > 1 ? (
				<Pagination
					hasMore={hasMore}
					totalPages={totalPages}
					handlePage={handlePage}
					reset={reset}
					className='border-t-0 text-sm'
				/>
			) : null}
		</>
	);
}
