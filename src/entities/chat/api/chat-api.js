import axios from 'axios'

const api = axios.create({
  baseURL: '',
})

const buildRequestConfig = token => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const fetchChatData = async token => {
  const requestConfig = buildRequestConfig(token)

  const [channelsResponse, messagesResponse] = await Promise.all([
    api.get('/api/v1/channels', requestConfig),
    api.get('/api/v1/messages', requestConfig),
  ])

  return {
    channels: channelsResponse.data,
    messages: messagesResponse.data,
  }
}

export const postMessage = async ({
  token, body, channelId, username,
}) => {
  const requestConfig = buildRequestConfig(token)
  const response = await api.post('/api/v1/messages', { body, channelId, username }, requestConfig)
  return response.data
}

export const postChannel = async ({ token, name }) => {
  const requestConfig = buildRequestConfig(token)
  const response = await api.post('/api/v1/channels', { name }, requestConfig)
  return response.data
}

export const patchChannel = async ({ token, channelId, name }) => {
  const requestConfig = buildRequestConfig(token)
  const response = await api.patch(`/api/v1/channels/${channelId}`, { name }, requestConfig)
  return response.data
}

export const deleteChannel = async ({ token, channelId }) => {
  const requestConfig = buildRequestConfig(token)
  const response = await api.delete(`/api/v1/channels/${channelId}`, requestConfig)
  return response.data
}

export const isUnauthorizedError = error => axios.isAxiosError(error) && error.response && error.response.status === 401
