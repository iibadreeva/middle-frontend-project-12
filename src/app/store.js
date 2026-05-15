import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth-slice';
import { loadAuth } from '../features/auth/auth-storage.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: loadAuth(),
  },
});

export default store;
