import { PublicClientType } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearPersist } from '../clientFunctions';
import { Types } from 'mongoose';

const mongoId = new Types.ObjectId('6000000aac0fc18695d23aaa');

export interface UserState {
	token: string;
	loggedIn: boolean;
	client: PublicClientType;
}

export const initialState: UserState = {
	loggedIn: false,
	token: '',
	client: {
		_id: mongoId,
		clientNumber: 0,
		firstName: '',
		lastName: '',
		loggedIn: false,
		email: '',
		phoneNumber: 0,
		city: '',
		country: '',
		address: '',
		postalCode: '',
		image: '',
		token: '',
		accounts: [],
	},
};

export const clientSlice = createSlice({
	name: 'client',
	initialState,
	reducers: {
		loadClient: (state, action: PayloadAction<PublicClientType>) => {
			const { loggedIn, token } = action.payload;
			state.client = { ...action.payload };
			state.loggedIn = loggedIn;
			state.token = token;
		},
		updateClient: (state, action: PayloadAction<PublicClientType>) => {
			const { loggedIn, token } = action.payload;
			state.client = { ...state.client, ...action.payload };
			state.loggedIn = loggedIn;
			state.token = token;
		},
		logoutClient: (state) => {
			clearPersist();
			return initialState;
		},
	},
});

// Action creators are generated for each case reducer function
export const { loadClient, updateClient, logoutClient } = clientSlice.actions;

export default clientSlice.reducer;
