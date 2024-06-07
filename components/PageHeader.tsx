type Props = {
	title: string;
	subtitle?: string;
};

export default function PageHeader({ title, subtitle }: Props) {
	return (
		<section className='sm:pt-10'>
			<p className='text-2xl sm:text-4xl font-bold mb-1'>{title}</p>
			{subtitle ? <p className='sm:text-xl'>{subtitle}</p> : null}
		</section>
	);
}
