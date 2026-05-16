const storageKey = 'auth';

const emptySession = {
  username: null,
  token: null,
  isAuthenticated: false,
};

export const loadSession = () => {
  try {
    const rawSession = localStorage.getItem(storageKey);

    if (rawSession === null) {
      return emptySession;
    }

    const session = JSON.parse(rawSession);

    if (typeof session.token !== 'string' || typeof session.username !== 'string') {
      return emptySession;
    }

    return {
      username: session.username,
      token: session.token,
      isAuthenticated: true,
    };
  } catch (error) {
    return emptySession;
  }
};

export const saveSession = ({ token, username }) => {
  localStorage.setItem(storageKey, JSON.stringify({ token, username }));
};

export const clearSession = () => {
  localStorage.removeItem(storageKey);
};
