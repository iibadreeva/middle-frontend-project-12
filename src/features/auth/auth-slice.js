import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
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

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
