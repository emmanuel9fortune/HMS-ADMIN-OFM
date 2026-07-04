import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/patientSlice';
import antenatalReducer from '../features/antenatalSlice';
import idReducer from '../features/idSlice';
import infoReducer from '../features/infoSlice';
import cartReducer from '../features/cartSlice';
import reloadReducer from '../features/reloadSlice';
import ipReducer from '../features/ipSlice';

export const store = configureStore({
  reducer: {
    info: infoReducer,
    id: idReducer,
    antenatal: antenatalReducer,
    patient: patientReducer,
    ip: ipReducer,
    reload: reloadReducer,
    cart: cartReducer,
  },
});