import AdminAddAccount from "./AdminAddAccount";
import AdminAddPayee from "./AdminAddPayee";

export default function Admin() {
	return (
		<div className='auth-section flex flex-col'>
			<AdminAddPayee />
			<AdminAddAccount />
		</div>
	);
}
