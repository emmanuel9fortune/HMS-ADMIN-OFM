import { createSlice } from '@reduxjs/toolkit';

export const antenatalSlice = createSlice({
  name: 'antenatal',
  initialState: {
    antenatal: null,
  },
  reducers: {
    setantenatals: (state, action) => {
      state.antenatal = action.payload;
    },
  },
});

export const { setantenatals } = antenatalSlice.actions;

export const selectantenatal = (state) => state.antenatal.antenatal;

export default antenatalSlice.reducer;