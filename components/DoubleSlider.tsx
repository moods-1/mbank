import { SlideLoader } from './Loaders';

type Props = {
	height?: string;
};
export default function DoubleSlider({ height }: Props) {
	return (
		<div className='w-full mt-1'>
			<SlideLoader className={`${height ? height : 'h-10'}`} />
			<SlideLoader className={`${height ? height : 'h-10'}`} />
		</div>
	);
}
