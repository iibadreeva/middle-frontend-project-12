import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  token: null,
  isAuthenticated: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (state, action) => ({
      ...state,
      username: action.payload.username,
      token: action.payload.token,
      isAuthenticated: true,
    }),
    clearCredentials: () => initialState,
  },
});

export const { setCredentials, clearCredentials } = sessionSlice.actions;

export default sessionSlice.reducer;
