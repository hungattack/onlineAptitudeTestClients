'use client';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userData from './userData';
import testingData from './testingData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
};
const rootReducer = combineReducers({ userData, testingData });
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: { persistedReducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
