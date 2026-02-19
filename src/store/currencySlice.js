import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
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

export default currencySlice.reducer;
