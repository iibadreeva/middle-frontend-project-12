import { configureStore } from '@reduxjs/toolkit'
import { chatReducer } from '@/entities/chat'
import { loadSession, sessionReducer } from '@/entities/session'

const store = configureStore({
  reducer: {
    session: sessionReducer,
    chat: chatReducer,
  },
  preloadedState: {
    session: loadSession(),
  },
})

export default store
