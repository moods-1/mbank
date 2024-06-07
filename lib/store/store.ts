import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
// The following import is done to prevent this error:
// redux-persist failed to create sync storage. falling back to noop storage.
import storage from './customStorage';
import clientReducer from './clientSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const clientPersistConfig = {
	key: 'client',
	storage: storage,
	whitelist: ['client', 'loggedIn', 'token', 'accounts'],
};

const rootReducer = combineReducers({
	client: persistReducer(clientPersistConfig, clientReducer),
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
