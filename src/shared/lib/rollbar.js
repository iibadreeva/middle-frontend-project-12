/* global __ROLLBAR_ACCESS_TOKEN__, __ROLLBAR_ENVIRONMENT__, __ROLLBAR_CODE_VERSION__ */

import Rollbar from 'rollbar';

const rollbarAccessToken = __ROLLBAR_ACCESS_TOKEN__.trim();

export const isRollbarEnabled = Boolean(rollbarAccessToken);

export const rollbarConfig = {
  accessToken: rollbarAccessToken,
  environment: __ROLLBAR_ENVIRONMENT__.trim(),
  codeVersion: __ROLLBAR_CODE_VERSION__.trim() || undefined,
  captureUncaught: true,
  captureUnhandledRejections: true,
  scrubFields: ['password', 'token', 'secret', 'authorization', 'cookie', 'csrf_token'],
};

// Единый экземпляр нужен и React-дереву, и обычным async-модулям вне компонентов.
export const rollbar = isRollbarEnabled ? new Rollbar(rollbarConfig) : null;

export const buildRollbarPerson = (session = {}) => {
  const username = typeof session.username === 'string' ? session.username : null;
  const userId =
    typeof session.userId === 'string' || typeof session.userId === 'number'
      ? String(session.userId)
      : null;

  if (!username && !userId) {
    return {};
  }

  return {
    // При появлении стабильного userId он автоматически станет основным идентификатором.
    id: userId || username,
    ...(username ? { username } : {}),
  };
};

export const configureRollbarPerson = (session) => {
  if (!rollbar) {
    return;
  }

  rollbar.configure({
    payload: {
      person: buildRollbarPerson(session),
    },
  });
};

const getErrorStatus = (error) => {
  if (!error || !error.response || typeof error.response.status === 'undefined') {
    return null;
  }

  return error.response.status;
};

const reportToRollbar = ({ error, extra = {}, level = 'error', message }) => {
  // Без токена тихо пропускаем логирование, чтобы локальная разработка не падала.
  if (!rollbar) {
    return;
  }

  const payload = {
    ...extra,
    ...(getErrorStatus(error) ? { status: getErrorStatus(error) } : {}),
  };

  if (error) {
    rollbar[level](message, error, payload);
    return;
  }

  rollbar[level](message, payload);
};

export const logRollbarError = (params) => reportToRollbar({ ...params, level: 'error' });

export const logRollbarWarning = (params) => reportToRollbar({ ...params, level: 'warning' });
