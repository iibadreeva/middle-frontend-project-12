import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearCredentials } from '../auth/auth-slice';
import { clearAuth } from '../auth/auth-storage.js';
import { disconnectChatSocket } from './chat-socket';

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

const resetChatType = 'chat/resetChat';

// При невалидной сессии очищаем auth, localStorage и socket одновременно,
// чтобы после logout/401 в store не возвращались запоздалые события.
const clearSession = (dispatch) => {
  disconnectChatSocket();
  clearAuth();
  dispatch(clearCredentials());
  dispatch({ type: resetChatType });
};

// Сообщение может прийти и из POST-ответа, и через socket broadcast,
// поэтому добавляем его в store только если такого id еще нет.
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

  // Если текущий канал валиден, сохраняем выбор пользователя.
  const hasCurrentChannel = channels.some((channel) => channel.id === currentChannelId);

  if (hasCurrentChannel) {
    return currentChannelId;
  }

  // При первой загрузке стараемся открыть general, как требует задание.
  const generalChannel = channels.find((channel) => channel.name === 'general');

  if (generalChannel) {
    return generalChannel.id;
  }

  return channels[0].id;
};

export const fetchInitialChatData = createAsyncThunk(
  'chat/fetchInitialChatData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { token } = getState().auth;

    if (!token) {
      return rejectWithValue('missing-token');
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const [channelsResponse, messagesResponse] = await Promise.all([
        axios.get('/api/v1/channels', requestConfig),
        axios.get('/api/v1/messages', requestConfig),
      ]);

      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        clearSession(dispatch);
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('load-failed');
    }
  },
  {
    // Защищаемся от повторной инициализации, например из-за StrictMode.
    condition: (_, { getState }) => getState().chat.fetchStatus === 'idle',
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (body, { dispatch, getState, rejectWithValue }) => {
    const {
      auth: { token, username },
      chat: { currentChannelId },
    } = getState();

    const trimmedBody = body.trim();

    if (!token || !username || !currentChannelId || trimmedBody === '') {
      return rejectWithValue('invalid-message');
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        '/api/v1/messages',
        { body: trimmedBody, channelId: currentChannelId, username },
        requestConfig,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        clearSession(dispatch);
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
    // Новые сообщения приходят из socket-подписки и попадают в общий список чата.
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
      // Отправка сообщения отслеживается отдельно, чтобы не смешивать ее
      // с первоначальной загрузкой каналов и сообщений.
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
        sendError: action.payload === 'unauthorized' ? null : action.payload || 'send-failed',
      }));
  },
});

export const {
  setCurrentChannel,
  messageReceived,
  socketConnected,
  socketDisconnected,
  socketErrored,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
