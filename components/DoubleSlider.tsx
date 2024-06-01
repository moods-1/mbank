import { SlideLoader } from "./Loaders";

export default function DoubleSlider() {
	return (
		<div className='w-full mt-1'>
			<SlideLoader className='h-10' />
			<SlideLoader className='h-10 ' />
		</div>
	);
}
