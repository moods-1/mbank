export const CLIENT_HEADER_LINKS = [
	{
		title: 'Accounts',
		link: '/client',
	},
	{
		title: 'Pay & Transfer',
		link: '/client/pay-transfer',
	},
];

export const CLIENT_SLUG_ROUTES: Record<string, string> = {
	'Savings Account': 'sa',
	'Tax-Free Savings Account': 'tfsa',
	'Retirement Savings Account': 'rsa',
	'No-Fee Chequing Account': 'nfca',
	'Global Mastercard': 'gm',
	'Mortgage': 'mortgage',
	'Home Equity Line of Credit': 'heloc',
	'Line of Credit': 'loc',
};

export const HEADER_LINKS = [
	{
		title: 'Save',
		link: '',
		subsection: [
			{
				label: 'Savings Account',
				link: '/save/savings-account',
				icon: '',
			},
			{
				label: 'Tax-Free Savings Account',
				link: '/save/tfsa',
				icon: '',
			},
			{
				label: 'Retirement Savings Account',
				link: '/save/rsa',
				icon: '',
			},
		],
	},
	{
		title: 'Spend',
		link: '',
		subsection: [
			{
				label: 'No-Fee Chequing Account',
				link: '/spend/chequing-account',
				icon: '',
			},
			{
				label: 'Global Mastercard',
				link: '/spend/mastercard',
				icon: '',
			},
		],
	},
	{
		title: 'Borrow',
		link: '',
		subsection: [
			{
				label: 'Mortgage',
				link: '/borrow/mortgage',
				icon: '',
			},
			{
				label: 'Home Equity Line of Credit',
				link: '/borrow/heloc',
				icon: '',
			},
			{
				label: 'Line of Credit',
				link: '/borrow/loc',
				icon: '',
			},
		],
	},
	{
		title: 'Rates',
		link: '/rates',
		subsection: [],
	},
];

export const CUSTOMERS_LOVE = [
	{
		title: 'Friendly',
		body: 'Without you we would not exist and we always greet you with that in mind.',
		image: '/images/greeting.jpg',
	},
	{
		title: 'Personalized Advice',
		body: "Everyone's financial goals are unique and important to us.",
		image: '/images/advice.jpg',
	},
	{
		title: 'Locations',
		body: 'Many branches to maintain that personal touch.',
		image: '/images/branch-teller.jpg',
	},
];

export const ACCOUNT_NAMES = {
	SAVINGS_ACCOUNT: 'Savings Account',
	TAX_FREE_SAVINGS_ACCOUNT: 'Tax-Free Savings Account',
	RETIREMENT_SAVINGS_ACCOUNT: 'Retirement Savings Account',
	NO_FEE_CHEQUING_ACCOUNT: 'No-Fee Chequing Account',
	GLOBAL_MASTERCARD: 'Global MasterCard',
	MORTGAGE: 'Mortgage',
	HOME_EQUITY_LINE_OF_CREDIT: 'Home Equity Line of Credit',
	LINE_OF_CREDIT: 'Line of Credit',
};

export const ACCOUNT_TYPES = {
	SAVINGS: 'Savings',
	CHEQUING: 'Chequing',
	CREDIT: 'Credit',
};

export const ACCOUNT_TYPE_NUMBER: Record<string, string> = {
	'001': 'Savings Account',
	'002': 'Tax-Free Savings Account',
	'003': 'Retirement Savings Account',
	'004': 'No-Fee Chequing Account',
	'005': 'Global Mastercard',
	'006': 'Mortgage',
	'007': 'Home Equity Line of Credit',
	'008': 'Line of Credit',
};

// Footer protection section

export const PROTECTION_DATA = [
	{
		alt: 'cidc',
		image1: '/images/cdic-1.svg',
		image2: '/images/cdic-badge.svg',
		link: 'https://www.cdic.ca',
		text: 'Your deposits may be insurable by the Canada Deposit Insurance Corporation.',
	},
	{
		alt: 'ciro',
		image1: '/images/ciro-white.png',
		image2: '',
		link: 'https://www.ciro.ca',
		text: 'CIRO regulation applies to MBank Investment Services Inc., a separate company from and a wholly-owned subsidiary of MBank.',
	},
];
