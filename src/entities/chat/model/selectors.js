export const selectChat = (state) => state.chat;
export const selectChannels = (state) => selectChat(state).channels;
export const selectMessages = (state) => selectChat(state).messages;
export const selectCurrentChannelId = (state) => selectChat(state).currentChannelId;
export const selectFetchStatus = (state) => selectChat(state).fetchStatus;
export const selectSendStatus = (state) => selectChat(state).sendStatus;
export const selectSocketStatus = (state) => selectChat(state).socketStatus;
export const selectLoadError = (state) => selectChat(state).loadError;
export const selectSendError = (state) => selectChat(state).sendError;
export const selectConnectionError = (state) => selectChat(state).connectionError;
export const selectCurrentChannel = (state) => {
  const channels = selectChannels(state);
  const currentChannelId = selectCurrentChannelId(state);

  return channels.find((channel) => channel.id === currentChannelId) || null;
};
export const selectCurrentMessages = (state) => {
  const messages = selectMessages(state);
  const currentChannelId = selectCurrentChannelId(state);

  return messages.filter((message) => message.channelId === currentChannelId);
};
