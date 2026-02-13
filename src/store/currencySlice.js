import { createSlice } from '@reduxjs/toolkit';

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    orgCurrency: 'USD',
  },
  reducers: {
    setOrgCurrency: (state, action) => {
      state.orgCurrency = action.payload;
    },
  },
});

export const { setOrgCurrency } = currencySlice.actions;
export default currencySlice.reducer;
