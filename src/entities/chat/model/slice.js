import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  deleteChannel,
  fetchChatData,
  isUnauthorizedError,
  patchChannel,
  postChannel,
  postMessage,
} from '../api/chat-api.js';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  fetchStatus: 'idle',
  sendStatus: 'idle',
  addChannelStatus: 'idle',
  renameChannelStatus: 'idle',
  removeChannelStatus: 'idle',
  socketStatus: 'idle',
  loadError: null,
  sendError: null,
  addChannelError: null,
  renameChannelError: null,
  removeChannelError: null,
  connectionError: null,
};

const addMessage = (messages, message) => {
  const hasMessage = messages.some((currentMessage) => currentMessage.id === message.id);

  if (hasMessage) {
    return messages;
  }

  return [...messages, message];
};

const addChannel = (channels, channel) => {
  const hasChannel = channels.some((currentChannel) => currentChannel.id === channel.id);

  if (hasChannel) {
    return channels.map((currentChannel) =>
      currentChannel.id === channel.id ? channel : currentChannel,
    );
  }

  return [...channels, channel];
};

const renameExistingChannel = (channels, channel) =>
  channels.map((currentChannel) =>
    currentChannel.id === channel.id ? { ...currentChannel, ...channel } : currentChannel,
  );

const removeExistingChannel = (channels, channelId) =>
  channels.filter((channel) => channel.id !== channelId);

const removeChannelMessages = (messages, channelId) =>
  messages.filter((message) => message.channelId !== channelId);

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

export const addNewChannel = createAsyncThunk(
  'chat/addNewChannel',
  async (name, { getState, rejectWithValue }) => {
    const {
      session: { token },
    } = getState();
    const trimmedName = name.trim();

    if (!token || trimmedName === '') {
      return rejectWithValue('invalid-channel-name');
    }

    try {
      return await postChannel({
        token,
        name: trimmedName,
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('add-channel-failed');
    }
  },
);

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ channelId, name }, { getState, rejectWithValue }) => {
    const {
      session: { token },
    } = getState();
    const trimmedName = name.trim();

    if (!token || !channelId || trimmedName === '') {
      return rejectWithValue('invalid-channel-name');
    }

    try {
      return await patchChannel({
        token,
        channelId,
        name: trimmedName,
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('rename-channel-failed');
    }
  },
);

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (channelId, { getState, rejectWithValue }) => {
    const {
      session: { token },
    } = getState();

    if (!token || !channelId) {
      return rejectWithValue('invalid-channel-id');
    }

    try {
      return await deleteChannel({
        token,
        channelId,
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('remove-channel-failed');
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
    channelAdded: (state, action) => ({
      ...state,
      channels: addChannel(state.channels, action.payload),
    }),
    channelRenamed: (state, action) => ({
      ...state,
      channels: renameExistingChannel(state.channels, action.payload),
    }),
    channelRemoved: (state, action) => {
      const nextChannels = removeExistingChannel(state.channels, action.payload.id);

      return {
        ...state,
        channels: nextChannels,
        messages: removeChannelMessages(state.messages, action.payload.id),
        currentChannelId: getCurrentChannelId(nextChannels, state.currentChannelId),
      };
    },
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
      }))
      .addCase(addNewChannel.pending, (state) => ({
        ...state,
        addChannelStatus: 'loading',
        addChannelError: null,
      }))
      .addCase(addNewChannel.fulfilled, (state, action) => ({
        ...state,
        channels: addChannel(state.channels, action.payload),
        currentChannelId: action.payload.id,
        addChannelStatus: 'idle',
        addChannelError: null,
      }))
      .addCase(addNewChannel.rejected, (state, action) => ({
        ...state,
        addChannelStatus: 'idle',
        addChannelError: action.payload || 'add-channel-failed',
      }))
      .addCase(renameChannel.pending, (state) => ({
        ...state,
        renameChannelStatus: 'loading',
        renameChannelError: null,
      }))
      .addCase(renameChannel.fulfilled, (state, action) => ({
        ...state,
        channels: renameExistingChannel(state.channels, action.payload),
        renameChannelStatus: 'idle',
        renameChannelError: null,
      }))
      .addCase(renameChannel.rejected, (state, action) => ({
        ...state,
        renameChannelStatus: 'idle',
        renameChannelError: action.payload || 'rename-channel-failed',
      }))
      .addCase(removeChannel.pending, (state) => ({
        ...state,
        removeChannelStatus: 'loading',
        removeChannelError: null,
      }))
      .addCase(removeChannel.fulfilled, (state, action) => {
        const nextChannels = removeExistingChannel(state.channels, action.payload.id);

        return {
          ...state,
          channels: nextChannels,
          messages: removeChannelMessages(state.messages, action.payload.id),
          currentChannelId: getCurrentChannelId(nextChannels, state.currentChannelId),
          removeChannelStatus: 'idle',
          removeChannelError: null,
        };
      })
      .addCase(removeChannel.rejected, (state, action) => ({
        ...state,
        removeChannelStatus: 'idle',
        removeChannelError: action.payload || 'remove-channel-failed',
      }));
  },
});

export const {
  channelAdded,
  channelRemoved,
  channelRenamed,
  messageReceived,
  resetChat,
  setCurrentChannel,
  socketConnected,
  socketDisconnected,
  socketErrored,
} = chatSlice.actions;

export default chatSlice.reducer;
