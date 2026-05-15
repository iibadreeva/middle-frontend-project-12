const storageKey = 'auth';

export const loadAuth = () => {
  try {
    const rawAuth = localStorage.getItem(storageKey);

    if (rawAuth === null) {
      return {
        username: null,
        token: null,
        isAuthenticated: false,
      };
    }

    const auth = JSON.parse(rawAuth);

    if (typeof auth.token !== 'string' || typeof auth.username !== 'string') {
      return {
        username: null,
        token: null,
        isAuthenticated: false,
      };
    }

    return {
      username: auth.username,
      token: auth.token,
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      username: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

export const saveAuth = ({ token, username }) => {
  localStorage.setItem(storageKey, JSON.stringify({ token, username }));
};

export const clearAuth = () => {
  localStorage.removeItem(storageKey);
};
