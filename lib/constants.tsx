export const CLIENT_HEADER_LINKS = [
	{
		title: 'Accounts',
		link: '/client',
	},
	{
		title: 'Pay and Transfer',
		link: '/client/pay-transfer',
	},
];

export const CLIENT_SLUG_ROUTES: Record<string, string> = {
	'Savings Account': 'sa',
	'Tax-Free Savings Account': 'tfsa',
	'Retirement Savings Account': 'rsa',
	'No-Fee Chequing Account': 'nfca',
	'Global Mastercard': 'gm',
	Mortgage: 'mortgage',
	'Home Equity Line of Credit': 'heloc',
	'Line of Credit': 'loc',
};

export const HEADER_LINKS = [
	{
		title: 'Rates',
		link: '/rates',
		subsection: [],
	},
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

export const DEBT_SET = new Set(['005', '006', '007', '008']);

// Footer protection section

export const PROTECTION_DATA = [
	{
		alt: 'cidc',
		image1: '/images/cdic.svg',
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
// Rates //

export const RATES = {
	Savings: {
		subtitle: 'Earn a great interest rate on your Savings Account.',
		data: [
			{
				label: 'Savings Account',
				rate: '0.70%',
				link: '/save/savings-account',
			},
			{
				label: 'Tax-Free Savings Account',
				rate: '0.70%',
				link: '/save/tfsa',
			},
			{
				label: 'Retirement Savings Account',
				rate: '0.70%',
				link: '/save/rsa',
			},
		],
	},
	Mortgage: {
		subtitle: 'Rates to help you own your home faster.',
		data: [
			{
				label: '5 Year Variable',
				rate: '6.80%',
				link: '/borrow/mortgage',
			},
			{
				label: '1 Year Fixed Mortgage',
				rate: '7.29%',
				link: '/borrow/mortgage',
			},
			{
				label: '2 Year Fixed Mortgage',
				rate: '6.39%',
				link: '/borrow/mortgage',
			},
			{
				label: '3 Year Fixed Mortgage',
				rate: '5.49%',
				link: '/borrow/mortgage',
			},
			{
				label: '4 Year Fixed Mortgage',
				rate: '5.55%',
				link: '/borrow/mortgage',
			},
			{
				label: '5 Year Fixed Mortgage',
				rate: '5.45%',
				link: '/borrow/mortgage',
			},
			{
				label: '7 Year Fixed Mortgage',
				rate: '5.85%',
				link: '/borrow/mortgage',
			},
			{
				label: '10 Year Fixed Mortgage',
				rate: '6.30%',
				link: '/borrow/mortgage',
			},
		],
	},
	'Line of Credit': {
		subtitle: 'Friendship rates for you.',
		data: [
			{
				label: 'Home Equity Line of Credit',
				rate: '7.55%',
				link: '/borrow/heloc',
			},
			{
				label: 'Line of Credit',
				rate: '7.85%',
				link: '/borrow/loc',
			},
		],
	},
};

export const PAYEE_BUSINESS_TYPES = {
	COMMUNICATIONS: 'Communications',
	FINANCIAL: 'Financial',
	RETAIL: 'Retail',
	FOOD_DINING: 'Food and Dining',
	COMPUTERS_ELECTRONICS: 'Computers and Electronics',
	HOME_GARDEN: 'Home and Garden',
	TRAVEL_TRANSPORTATION: 'Travel and Transportation',
	AUTOMOTIVE: 'Automotive',
	UTILITIES: 'Utilities',
	GOVERNMENT: 'Government'
};

export const PROVINCES_TERRITORIES = {
	AB: 'Alberta',
	BC: 'British Columbia',
	MB: 'Manitoba',
	NB: 'New Brunswick',
	NL: 'Newfoundland and Labrador',
	NS: 'Nova Scotia',
	NT: 'Northwest Territories',
	NU: 'Nunavut',
	ON: 'Ontario',
	PE: 'Prince Edward Island',
	QC: 'Quebec',
	SK: 'Saskatchewan',
	YT: 'Yukon',
};

export const INITIAL_PAYMENT_FORM = {
	transactionDate: new Date(),
	destinationId: '',
	destinationName: '',
	amount: '',
	clientId: '',
	sourceAccount: '',
	sourceAccountName: '',
	accountBalance: 2,
};

export const TRANSACTION_HEADERS = [
	{
		label: 'Date',
		field: 'date',
		filterable: false,
	},
	{
		label: 'Entity',
		field: 'destinationName',
		filterable: true,
	},
	{
		label: 'Funds In',
		field: 'credit',
		filterable: false,
	},
	{
		label: 'Funds Out',
		field: 'debit',
		filterable: false,
	},
	{
		label: 'Balance',
		field: 'accountBalance',
		filterable: false,
	},
];

export const STATIC_DATE_BUTTONS = [
	{
		label: 'Last 4 Weeks',
		id: 0,
		range: 30,
	},
	{
		label: 'Last 3 Months',
		id: 1,
		range: 90,
	},
	{
		label: 'Last 6 Months',
		id: 2,
		range: 182,
	},
	{
		label: 'Last Year',
		id: 3,
		range: 365,
	},
];

export const donutChartOptions = {
	cutout: 38,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			callbacks: {
				label: function (context: any) {
					let label = context.dataset.label || '';

					if (label) {
						label += ': ';
					}
					if (context.parsed !== null) {
						label += new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(context.parsed);
					}
					return label;
				},
			},
		},
	},
};

// Contact Us

export const CONTACT_US_SELECT_OPTIONS = [
	'MBank Telephone Banking',
	'Personal Bank Accounts',
	'Mortgage Specialist',
	'Credit Cards',
];

export const PHONE_OPTIONS = [
	{
		language: 'English',
		number: '1-866-555-1234',
		option: '',
	},
	{
		language: 'French',
		number: '1-800-555-1234',
		option: '',
	},
	{
		language: 'Cantonese',
		number: '1-800-555-4321',
		option: 'option 1',
	},
	{
		language: 'Mandarin',
		number: '1-866-555-4321',
		option: 'option 2',
	},
];

export const CONTACT_PERSONAL_ACCOUNTS = {
	points: [
		'Log into MBank on your desktop',
		'Select your Chequing or Savings account',
		'On the bottom right of your screen, select the messaging icon and type in your question to begin your live agent conversation',
	],
	text: 'We will get back to you either immediately or when the next live agent is available, between the hours of 9 am to 11 pm ET Monday to Friday and between 10 am to 7 pm ET Saturday and Sunday.',
	button1Text: 'Login into MBank',
};

export const CONTACT_MBANK_APP = {
	points: [
		'Log into the MBank app on your mobile device',
		'Scroll down and select “Contact Us” from the MBank app menu',
		'Select “Call Us” and choose MBank',
	],
	text: 'If you do not have the MBank app, download the app below.',
	text2:
		'The MBank app “Call Us” feature only works if you are physically located in Canada.',
	button1Text: 'Apple iOS',
	button2Text: 'Android',
};

export const MIXPANEL_TOKEN =
	process.env.MIXPANEL_TOKEN || process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
