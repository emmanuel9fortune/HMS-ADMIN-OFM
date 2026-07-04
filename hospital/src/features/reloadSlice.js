import { createSlice } from '@reduxjs/toolkit';

export const reloadSlice = createSlice({
  name: 'reload',
  initialState: {
    reload: null,
  },
  reducers: {
    setreloads: (state, action) => {
      state.reload = action.payload;
    },
  },
});

export const { setreloads } = reloadSlice.actions;

export const selectreload = (state) => state.reload.reload;

export default reloadSlice.reducer;