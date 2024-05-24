import { ClientType } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
	loggedIn: boolean;
	client: ClientType;
}

const now = new Date();

export const initialState: UserState = {
	loggedIn: false,
	client: {
		_id: '',
		firstName: 'Carl',
		lastName: 'Moods',
		loggedIn: false,
		email: '',
		phoneNumber: 0,
		image: '',
		password:'',
		createdAt: now,
		updatedAt: now,
		accounts: [],
	},
};

export const counterSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateClient: (state, action: PayloadAction<ClientType>) => {
			const { loggedIn } = action.payload;
			state.client = { ...state.client, ...action.payload };
			state.loggedIn = loggedIn;
		},
		logoutClient: (state) => {
			return initialState;
		},
	},
});

// Action creators are generated for each case reducer function
export const { updateClient, logoutClient } = counterSlice.actions;

export default counterSlice.reducer;
