import { createSlice } from '@reduxjs/toolkit';

export const idSlice = createSlice({
  name: 'id',
  initialState: {
    id: null,
  },
  reducers: {
    setids: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setids } = idSlice.actions;

export const selectid = (state) => state.id.id;

export default idSlice.reducer;