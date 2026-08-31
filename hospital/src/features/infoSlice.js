import { createSlice } from '@reduxjs/toolkit';

export const infoSlice = createSlice({
  name: 'info',
  initialState: {
    info: null,
  },
  reducers: {
    setinfos: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setinfos } = infoSlice.actions;

export const selectinfo = (state) => state.info.info;

export default infoSlice.reducer;