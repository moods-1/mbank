import moment from 'moment-timezone';
import { AccountType, PayeeType } from './types';
import { Types } from 'mongoose';
import { DEBT_SET } from './constants';

export const firstCap = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatDate = (value: Date, format?: string) => {
	return moment(value).format(format || 'DD MMM YYYY h:mm A');
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const balanceCalculator = (accounts: AccountType[], type: string) => {
	let debtBalance: number = 0;
	let creditBalance: number = 0;
	accounts.forEach(({ accountBalance, debt }) => {
		if (type === 'debt' && debt) {
			debtBalance += accountBalance;
		} else if (type === 'credit' && !debt) {
			creditBalance += accountBalance;
		}
	});
	return type === 'credit' ? creditBalance : debtBalance;
};

export const accountsDonutChartData = (accounts: AccountType[]) => {
	const data: number[] = [];
	const labels: string[] = [];
	accounts.forEach(({ accountBalance, accountName }) => {
		data.push(accountBalance);
		labels.push(accountName);
	});
	return {
		datasets: [
			{
				data,
				backgroundColor: [
					'#000',
					'#DDD',
					'#333',
					'#AAA',
					'#666',
					'#999',				
				],
			},
		],
		labels,
	};
};

export const isDebt = (accountType: string) => {
	return DEBT_SET.has(accountType);
};

export const postalCodeGood = (data: string) => {
	const postalArr = data.split('');
	const returnSet = new Set();
	for (let x = 0; x < postalArr.length; x++) {
		if (x % 2 === 0) {
			returnSet.add(Number(postalArr[x]) ? false : true);
		} else {
			returnSet.add(Number(postalArr[x]) ? true : false);
		}
	}
	return !returnSet.has(false);
};

export const partOfDayGreeting = () => {
	let greeting: string;
	const now = new Date().getHours();
	if (now >= 12 && now < 18) {
		greeting = 'Good afternoon, ';
	} else if (now >= 18 && now < 21) {
		greeting = 'Good evening, ';
	} else if (now >= 21 && now < 24) {
		greeting = 'Good night, ';
	} else {
		greeting = 'Good morning, ';
	}
	return greeting;
};

// Local storage functions //

export const clearPersist = () => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('persist:client');
	}
};

export const getToken = () => {
	if (typeof window !== 'undefined') {
		const clientString = localStorage.getItem('persist:client');
		if (clientString && typeof clientString === 'string') {
			const client = JSON.parse(clientString);
			const { token } = client;
			return JSON.parse(token);
		}
	}
	return '';
};

export const getLoggedIn = () => {
	if (typeof window !== 'undefined') {
		const clientString = localStorage.getItem('persist:client');
		if (clientString && typeof clientString === 'string') {
			const client = JSON.parse(clientString);
			const { loggedIn } = client;
			const logged = JSON.parse(loggedIn);
			return logged === 'true' ? true : false;
		}
	}
	return false;
};

export const storeClientNumber = (clientNumber: string) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('clientNumber', JSON.stringify(clientNumber));
	}
};

export const clearClientNumber = () => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('clientNumber');
	}
};

export const getClientNumber = () => {
	let clientNumber: string | null;
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('clientNumber')) {
			clientNumber = localStorage.getItem('clientNumber');
			if (clientNumber) {
				return JSON.parse(clientNumber);
			}
		}
	}
	return '';
};

// Form validation //

export const FORM_FIELDS_DISPLAY: Record<string, string> = {
	firstName: 'First Name',
	lastName: 'Last Name',
	amount: 'Amount',
	name: 'Name',
	nickname: 'Nickname',
	payeeName: 'Payee Name',
	email: 'Email',
	message: 'Message',
	password: 'Password',
	clientNumber: 'Client Number',
	accountNumber: 'Account Number',
	accountName: 'Account Name',
	accountType: 'Account Type',
	city: 'City',
	province: 'Province',
	postalCode: 'Postal Code',
	phoneNumber: 'Phone Number',
	country: 'Country',
	image: 'Image',
	address: 'Address',
	businessType: 'Business Type',
	payeeId: 'Payee',
	sourceAccountName: 'Source',
	destinationName: 'Payee',
};

export const isValid = (type: string, pattern: string, value: string) => {
	if (type === 'text' && pattern) {
		const expression = new RegExp(pattern);
		return expression.test(value);
	}
};

export const VALIDATOR_OBJECT = {
	name: { min: 2, max: 50, pattern: '', patternText: '' },
	amount: { min: 1, max: 20, pattern: '', patternText: '' },
	subject: { min: 2, max: 50, pattern: '', patternText: '' },
	firstName: { min: 2, max: 30, pattern: '', patternText: '' },
	lastName: { min: 2, max: 30, pattern: '', patternText: '' },
	nickname: { min: 2, max: 15, pattern: '', patternText: '' },
	email: {
		min: 6,
		max: 50,
		pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$',
		patternText: 'Please enter a valid email address. (e.g. you@me.ca)',
	},
	message: { min: 3, max: 150, pattern: '', patternText: '' },
	password: {
		min: 6,
		max: 20,
		pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{6,}$',
		patternText: 'The format is incorrect or too short. (e.g. pAssword8)',
	},
	clientNumber: { min: 9, max: 9, pattern: '', patternText: '' },
	city: { min: 2, max: 30, pattern: '', patternText: '' },
	province: { min: 2, max: 30, pattern: '', patternText: '' },
	postalCode: {
		min: 6,
		max: 6,
		pattern: '^[A-Z0-9]$',
		patternText: 'Postal must contain 6 letters and numbers. (e.g. M1M2N2)',
	},
	phoneNumber: { min: 10, max: 10, pattern: '', patternText: '' },
	country: { min: 2, max: 30, pattern: '', patternText: '' },
	address: { min: 2, max: 60, pattern: '', patternText: '' },
	accountNumber: { min: 6, max: 30, pattern: '', patternText: '' },
	accountName: { min: 6, max: 30, pattern: '', patternText: '' },
	accountType: { min: 3, max: 3, pattern: '', patternText: '' },
	businessType: { min: 2, max: 30, pattern: '', patternText: '' },
	payeeName: { min: 2, max: 30, pattern: '', patternText: '' },
	payeeId: { min: 2, max: 30, pattern: '', patternText: '' },
	sourceAccountName: {
		min: 2,
		max: 30,
		pattern: '',
		patternText: 'Source is required.',
	},
	destinationName: {
		min: 2,
		max: 30,
		pattern: '',
		patternText: 'Destination is required.',
	},
};

export const requiredSet = new Set(['sourceAccountName', 'destinationName']);

export const validatorText = (target: string, min: number, max: number) => {
	let message: string = '';
	let mid: string = `between ${min} and ${max}`;
	mid = min === max ? `${max}` : mid;
	if (requiredSet.has(target)) {
		message = `The ${FORM_FIELDS_DISPLAY[target]} field is required.`;
	} else {
		message = `The ${FORM_FIELDS_DISPLAY[target]} field must be ${mid} characters.`;
	}
	return message;
};

export const generateMessage = (
	pattern: string,
	patternText: string,
	key: string,
	min: number,
	max: number
) => {
	return pattern ? patternText : validatorText(key, min, max);
};

type FormObject = {
	name?: string;
	amount?: string | number;
	nickname?: string;
	firstName?: string;
	lastName?: string;
	subject?: string;
	message?: string;
	password?: string;
	email?: string;
	city?: string;
	province?: string;
	country?: string;
	address?: string;
	postalCode?: string;
	clientNumber?: string | number;
	phoneNumber?: string;
	accountNumber?: Types.ObjectId | string | undefined;
	accountName?: string;
	accountType?: string;
	businessType?: string;
	payeeName?: string;
	payeeId?: Types.ObjectId | string | any;
	source?: Types.ObjectId | string | any;
	sourceAccountName?: string;
	destinationName?: string;
};

export const formValidator = (formObject: FormObject) => {
	const errorObject = {
		name: '',
		amount: '',
		nickname: '',
		firstName: '',
		lastName: '',
		subject: '',
		message: '',
		password: '',
		email: '',
		city: '',
		province: '',
		country: '',
		address: '',
		postalCode: '',
		clientNumber: '',
		phoneNumber: '',
		accountNumber: '',
		accountName: '',
		accountType: '',
		businessType: '',
		payeeName: '',
		payeeId: '',
		source: '',
		sourceAccountName: '',
		destinationName: '',
	};

	const errorSet = new Set();
	Object.entries(formObject).forEach(([key, value]) => {
		let error;
		const validator = VALIDATOR_OBJECT[
			key as keyof typeof VALIDATOR_OBJECT
		] || { min: 0, max: 1 };
		const { min, max, pattern, patternText } = validator;
		let message = generateMessage(pattern, patternText, key, min, max);
		switch (key) {
			case 'name':
				error = value.length < min || value.length > max;
				break;
			case 'amount':
				error = value.length < min || value.length > max;
				break;
			case 'nickname':
				error = value.length < min || value.length > max;
				break;
			case 'firstName':
				error = value.length < min || value.length > max;
				break;
			case 'lastName':
				error = value.length < min || value.length > max;
				break;
			case 'subject':
				error = value.length < min || value.length > max;
				break;
			case 'message':
				error = value.length < min || value.length > max;
				break;
			case 'password':
				error = value.length < min || value.length > max;
				break;
			case 'email':
				error = pattern
					? !isValid('text', pattern, value)
					: value.length < min || value.length > max;
				break;
			case 'phoneNumber':
				error = value.length < min || value.length > max;
				break;
			case 'city':
				error = value.length < min || value.length > max;
				break;
			case 'province':
				error = value.length < min || value.length > max;
				break;
			case 'country':
				error = value.length < min || value.length > max;
				break;
			case 'address':
				error = value.length < min || value.length > max;
				break;
			case 'postalCode':
				error = value.length < min || value.length > max;
				break;
			case 'clientNumber':
				error = value.length < min || value.length > max;
				break;
			case 'accountNumber':
				error = value.length < min || value.length > max;
				break;
			case 'accountName':
				error = value.length < min || value.length > max;
				break;
			case 'accountType':
				error = value.length < min || value.length > max;
				break;
			case 'businessType':
				error = value.length < min || value.length > max;
				break;
			case 'payeeName':
				error = value.length < min || value.length > max;
				break;
			case 'sourceAccountName':
				error = value.length < min || value.length > max;
				break;
			case 'destinationName':
				error = value.length < min || value.length > max;
				break;
			case 'payeeId':
				error = value.length < min || value.length > max;
				break;
			case 'source':
				error = value.length < min || value.length > max;
				break;
			default:
				message = '';
				error = false;
				break;
		}
		errorObject[key as keyof typeof errorObject] = error ? message : '';
		errorSet.add(error);
	});
	if (formObject.postalCode) {
		const goodPostal = postalCodeGood(formObject.postalCode);
		if (errorObject.postalCode || !goodPostal) {
			errorSet.add(true);
			errorObject.postalCode = 'The format is incorrect. (e.g. M1M2N2)';
		}
	}
	return { error: errorSet.has(true), errorObject };
};

export const formatPayeeOptions = (data: PayeeType[]) => {
	type Option = {
		label: string;
		value: Types.ObjectId | string | undefined;
	};
	const payeeOptions: Option[] = [];
	data.forEach(({ _id, payeeName }) => {
		payeeOptions.push({ label: payeeName, value: `${_id},${payeeName}` });
	});
	return payeeOptions;
};

export const randomString = (length: number) => {
	const alpha = ['a', 'B', 'c', 'D', 'e', '1', '2', '3', '4', '5'];
	let output: string = '';
	for (let i = 0; i < length; i++) {
		output += alpha[Math.floor(Math.random() * 9)];
	}
	return output;
};
