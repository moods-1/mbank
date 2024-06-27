import { Button } from '@/components/ui/button';

export default function Banner() {
	return (
		<div className=' w-full bg-[#eeeced] min-h-80 border flex flex-col lg:flex-row justify-between items-stretch h-auto'>
			<div className='bg-contactUsSmall bg-cover bg-no-repeat flex-1 min-h-80 xs:bg-contactUs' />
			<div className='flex-1 flex justify-center items-center p-6 min-h-80'>
				<div>
					<p className='max-w-lg text-lg sm:text-2xl font-medium'>
						Meet with an advisor, in branch or by phone, to discuss your
						personal banking needs. Booking an appointment is fast and easy.
					</p>
					<div className='w-full max-w-lg flex gap-5 mt-5 flex-wrap'>
						<Button className='flex-1 bg-bank-green hover:bg-green-800'>
							Book Now
						</Button>
						<Button
							className='flex-1 border-2 border-bank-green !text-bank-green'
							variant='outline'
						>
							Manage Existing Bookings
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
