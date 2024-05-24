import Link from "next/link";

export default function page() {
	return (
		<main>
			<section>
				<p className='page-title'>Client Home</p>
				<Link href={'/client/chequing'}>Chequing</Link>
			</section>
		</main>
	);
}
