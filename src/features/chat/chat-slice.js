import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearCredentials } from '../auth/auth-slice';
import { clearAuth } from '../auth/auth-storage.js';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  status: 'idle',
  error: null,
};

const getCurrentChannelId = (channels, currentChannelId) => {
  if (channels.length === 0) {
    return null;
  }

  const hasCurrentChannel = channels.some((channel) => channel.id === currentChannelId);

  if (hasCurrentChannel) {
    return currentChannelId;
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
        clearAuth();
        dispatch(clearCredentials());
        dispatch({ type: 'chat/resetChat' });

        return rejectWithValue('unauthorized');
      }

      return rejectWithValue('load-failed');
    }
  },
  {
    condition: (_, { getState }) => getState().chat.status === 'idle',
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
    resetChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialChatData.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(fetchInitialChatData.fulfilled, (state, action) => ({
        ...state,
        channels: action.payload.channels,
        messages: action.payload.messages,
        currentChannelId: getCurrentChannelId(action.payload.channels, state.currentChannelId),
        status: 'succeeded',
        error: null,
      }))
      .addCase(fetchInitialChatData.rejected, (state, action) => ({
        ...state,
        status: action.payload === 'unauthorized' ? 'idle' : 'failed',
        error: action.payload || 'load-failed',
      }));
  },
});

export const { setCurrentChannel, resetChat } = chatSlice.actions;

export default chatSlice.reducer;
