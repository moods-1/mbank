import { AccountType, ClientType, PublicClientType } from '@/lib/types';
import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { Types } from 'mongoose';

const mongoId = new Types.ObjectId('6000000aac0fc18695d23aaa');

export interface UserState {
	token: string;
	loggedIn: boolean;
	accounts: AccountType[];
	client: PublicClientType;
}

export const initialState: UserState = {
	loggedIn: false,
	token: '',
	accounts: [],
	client: {
		_id: mongoId,
		clientNumber: 0,
		firstName: '',
		lastName: '',
		loggedIn: false,
		email: '',
		phoneNumber: 0,
		city: '',
		province: '',
		country: '',
		address: '',
		postalCode: '',
		image: '',
		token: '',
		accounts: [],
		payees: [],
	},
};

type LoadClient = {
	accounts: AccountType[];
	client: PublicClientType;
};

export const clientSlice = createSlice({
	name: 'client',
	initialState,
	reducers: {
		loadClient: (state, action: PayloadAction<LoadClient>) => {
			const { accounts, client } = action.payload;
			const { loggedIn, token } = client;
			state.client = client;
			state.loggedIn = loggedIn;
			state.token = token;
			state.accounts = accounts;
		},
		updateClient: (state, action: PayloadAction<PublicClientType>) => {
			state.client = { ...state.client, ...action.payload };
			return;
		},
		logoutClient: (state) => {
			return initialState;
		},
		loadAccounts: (state, action: PayloadAction<AccountType[]>) => {
			state.accounts = [...action.payload];
		},
	},
});

// Action creators are generated for each case reducer function
export const { loadClient, updateClient, logoutClient, loadAccounts } =
	clientSlice.actions;

export default clientSlice.reducer;
