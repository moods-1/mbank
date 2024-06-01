import moment from 'moment-timezone';

export const formatDate = (value: Date, format?: string) => {
	return moment(value).format(format || 'DD MMM YYYY h:mm A');
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const partOfDayGreeting = () => {
	let greeting: string;
	const now = new Date().getHours();
	if (now >= 12 && now < 18) {
		greeting = 'Good afternoon, ';
	} else if (now >= 18 && now < 21) {
		greeting = 'Good evening, ';
	} else if (now >= 21 && now < 24) {
		greeting = 'Good night';
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
	name: 'Name',
	email: 'Email',
	message: 'Message',
	password: 'Password',
	clientNumber: 'Client Number',
	city: 'City',
	postalCode: 'Postal Code',
	phoneNumber: 'Phone Number',
	country: 'Country',
	image: 'Image',
	address: 'Address',
};

export const isValid = (type: string, pattern: string, value: string) => {
	if (type === 'text' && pattern) {
		const expression = new RegExp(pattern);
		return expression.test(value);
	}
};

export const VALIDATOR_OBJECT = {
	name: { min: 2, max: 50, pattern: '', patternText: '' },
	subject: { min: 2, max: 50, pattern: '', patternText: '' },
	firstName: { min: 2, max: 30, pattern: '', patternText: '' },
	lastName: { min: 2, max: 30, pattern: '', patternText: '' },
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
		pattern: '',
		patternText: '',
	},
	clientNumber: { min: 9, max: 9, pattern: '', patternText: '' },
	city: { min: 2, max: 30, pattern: '', patternText: '' },
	postalCode: {
		min: 6,
		max: 6,
		pattern: '^[A-Z0-9]$',
		patternText: 'Postal must contain 6 letters and numbers. (e.g. M1M2N2)',
	},
	phoneNumber: { min: 10, max: 10, pattern: '', patternText: '' },
	country: { min: 2, max: 30, pattern: '', patternText: '' },
	address: { min: 2, max: 60, pattern: '', patternText: '' },
};

export const validatorText = (target: string, min: number, max: number) => {
	let mid: string = `between ${min} and ${max}`;
	if (min === max) {
		mid = `${max}`;
	}
	return `The ${FORM_FIELDS_DISPLAY[target]} field must be ${mid} characters.`;
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
	firstName?: string;
	lastName?: string;
	subject?: string;
	message?: string;
	password?: string;
	email?: string;
	city?: string;
	country?: string;
	address?: string;
	postalCode?: string;
	clientNumber?: string;
	phoneNumber?: string;
};

export const formValidator = (formObject: FormObject) => {
	const errorObject = {
		name: '',
		firstName: '',
		lastName: '',
		subject: '',
		message: '',
		password: '',
		email: '',
		city: '',
		country: '',
		address: '',
		postalCode: '',
		clientNumber: '',
		phoneNumber: '',
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
			default:
				message = '';
				error = false;
				break;
		}
		errorObject[key as keyof typeof errorObject] = error ? message : '';
		errorSet.add(error);
	});
	return { error: errorSet.has(true), errorObject };
};
