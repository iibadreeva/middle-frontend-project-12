import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth-slice';
import { loadAuth } from '../features/auth/auth-storage.js';
import chatReducer from '../features/chat/chat-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  preloadedState: {
    auth: loadAuth(),
  },
});

export default store;
