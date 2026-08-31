import { createSlice } from '@reduxjs/toolkit';

export const ipSlice = createSlice({
  name: 'ip',
  initialState: {
    ip: null,
  },
  reducers: {
    setips: (state, action) => {
      state.ip = action.payload;
    },
  },
});

export const { setips } = ipSlice.actions;

export const selectip = (state) => state.ip.ip;

export default ipSlice.reducer;