import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChatData, isUnauthorizedError, postMessage } from '../api/chat-api.js';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  fetchStatus: 'idle',
  sendStatus: 'idle',
  socketStatus: 'idle',
  loadError: null,
  sendError: null,
  connectionError: null,
};

const addMessage = (messages, message) => {
  const hasMessage = messages.some((currentMessage) => currentMessage.id === message.id);

  if (hasMessage) {
    return messages;
  }

  return [...messages, message];
};

const getCurrentChannelId = (channels, currentChannelId) => {
  if (channels.length === 0) {
    return null;
  }

  const hasCurrentChannel = channels.some((channel) => channel.id === currentChannelId);

  if (hasCurrentChannel) {
    return currentChannelId;
  }

  const generalChannel = channels.find((channel) => channel.name === 'general');

  if (generalChannel) {
    return generalChannel.id;
  }

  return channels[0].id;
};

export const fetchInitialChatData = createAsyncThunk(
  'chat/fetchInitialChatData',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().session;

    if (!token) {
      return rejectWithValue('missing-token');
    }

    try {
      return await fetchChatData(token);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('load-failed');
    }
  },
  {
    condition: (_, { getState }) => getState().chat.fetchStatus === 'idle',
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (body, { getState, rejectWithValue }) => {
    const {
      session: { token, username },
      chat: { currentChannelId },
    } = getState();

    const trimmedBody = body.trim();

    if (!token || !username || !currentChannelId || trimmedBody === '') {
      return rejectWithValue('invalid-message');
    }

    try {
      return await postMessage({
        token,
        body: trimmedBody,
        channelId: currentChannelId,
        username,
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('send-failed');
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => ({
      ...state,
      currentChannelId: action.payload,
    }),
    messageReceived: (state, action) => ({
      ...state,
      messages: addMessage(state.messages, action.payload),
    }),
    socketConnected: (state) => ({
      ...state,
      socketStatus: 'connected',
      connectionError: null,
    }),
    socketDisconnected: (state) => ({
      ...state,
      socketStatus: 'disconnected',
      connectionError: 'Соединение потеряно. Пытаемся переподключиться.',
    }),
    socketErrored: (state) => ({
      ...state,
      socketStatus: 'error',
      connectionError: 'Не удалось подключиться к серверу сообщений.',
    }),
    resetChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialChatData.pending, (state) => ({
        ...state,
        fetchStatus: 'loading',
        loadError: null,
      }))
      .addCase(fetchInitialChatData.fulfilled, (state, action) => ({
        ...state,
        channels: action.payload.channels,
        messages: action.payload.messages,
        currentChannelId: getCurrentChannelId(action.payload.channels, state.currentChannelId),
        fetchStatus: 'succeeded',
        loadError: null,
      }))
      .addCase(fetchInitialChatData.rejected, (state, action) => ({
        ...state,
        fetchStatus: action.payload === 'unauthorized' ? 'idle' : 'failed',
        loadError: action.payload || 'load-failed',
      }))
      .addCase(sendMessage.pending, (state) => ({
        ...state,
        sendStatus: 'loading',
        sendError: null,
      }))
      .addCase(sendMessage.fulfilled, (state, action) => ({
        ...state,
        messages: addMessage(state.messages, action.payload),
        sendStatus: 'idle',
        sendError: null,
      }))
      .addCase(sendMessage.rejected, (state, action) => ({
        ...state,
        sendStatus: 'idle',
        sendError: action.payload || 'send-failed',
      }));
  },
});

export const {
  messageReceived,
  resetChat,
  setCurrentChannel,
  socketConnected,
  socketDisconnected,
  socketErrored,
} = chatSlice.actions;

export default chatSlice.reducer;
