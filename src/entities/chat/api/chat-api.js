import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

const buildRequestConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchChatData = async (token) => {
  const requestConfig = buildRequestConfig(token);

  const [channelsResponse, messagesResponse] = await Promise.all([
    api.get('/api/v1/channels', requestConfig),
    api.get('/api/v1/messages', requestConfig),
  ]);

  return {
    channels: channelsResponse.data,
    messages: messagesResponse.data,
  };
};

export const postMessage = async ({ token, body, channelId, username }) => {
  const requestConfig = buildRequestConfig(token);
  const response = await api.post('/api/v1/messages', { body, channelId, username }, requestConfig);
  return response.data;
};

export const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;
