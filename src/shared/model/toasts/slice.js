import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: ({ message, title = 'Уведомление', variant = 'success' }) => ({
        payload: {
          id: crypto.randomUUID(),
          message,
          title,
          variant,
        },
      }),
    },
    removeToast: (state, action) => state.filter((toast) => toast.id !== action.payload),
  },
});

export const { addToast, removeToast } = toastsSlice.actions;

export default toastsSlice.reducer;
