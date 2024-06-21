import Image from 'next/image';

interface Props {
	className?: string;
}

export default function Construction({ className }: Props) {
	return (
        <div className={`${className ? className : 'w-full'} mx-auto text-center p-5`}>
            <p className='text-xl font-semibold'>{"We're working on something great for you."}</p>
			<Image
				className='mx-auto'
                src='/images/mb-construction.png'
				width={1000}
				height={1000}
				alt='Coming Soon'
			/>
		</div>
	);
}
