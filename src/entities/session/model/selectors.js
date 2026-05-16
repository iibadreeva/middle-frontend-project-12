export const selectSession = (state) => state.session;
export const selectIsAuthenticated = (state) => selectSession(state).isAuthenticated;
export const selectSessionToken = (state) => selectSession(state).token;
export const selectUsername = (state) => selectSession(state).username;
