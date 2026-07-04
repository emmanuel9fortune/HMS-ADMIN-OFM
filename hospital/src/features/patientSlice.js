import { createSlice } from '@reduxjs/toolkit';

export const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patient: null,
  },
  reducers: {
    setpatients: (state, action) => {
      state.patient = action.payload;
    },
  },
});

export const { setpatients } = patientSlice.actions;

export const selectpatient = (state) => state.patient.patient;

export default patientSlice.reducer;