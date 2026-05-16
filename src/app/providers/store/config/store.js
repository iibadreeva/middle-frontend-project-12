import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from '@/entities/chat';
import { loadSession, sessionReducer } from '@/entities/session';
import { toastsReducer } from '@/shared/model/toasts';

const store = configureStore({
  reducer: {
    session: sessionReducer,
    chat: chatReducer,
    toasts: toastsReducer,
  },
  preloadedState: {
    session: loadSession(),
  },
});

export default store;
