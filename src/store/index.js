import { configureStore, createSlice } from '@reduxjs/toolkit';
import currencyReducer from './currencySlice';
import { baseApi } from './baseApi';

const roleSlice = createSlice({
    name: 'role',
    initialState: {
        roleData: {
            "header-items": {
                "CX-HR-001": { is_enabled: true }
            }
        }
    },
    reducers: {}
});

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    currency: currencyReducer,
    role: roleSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
