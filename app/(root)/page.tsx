import AppDevices from './AppDevices';
import Hero from './Hero';
import Ranking from './Ranking';
import WhyUs from './WhyUs';

export default function Home() {
	return (
		<main>
			<Hero />
			<WhyUs />
			<AppDevices />
			<Ranking />
		</main>
	);
}
