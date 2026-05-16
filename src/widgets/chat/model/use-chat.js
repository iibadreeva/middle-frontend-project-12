import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectChannels,
  selectCurrentChannel,
  selectCurrentChannelId,
  selectCurrentMessages,
  selectFetchStatus,
  selectLoadError,
  selectSendError,
  useChatBootstrap,
  useChatSocket,
} from '@/entities/chat';
import { selectIsAuthenticated } from '@/entities/session';
import { useLogout } from '@/features/logout';

const useChat = () => {
  const logout = useLogout();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const channels = useSelector(selectChannels);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentMessages = useSelector(selectCurrentMessages);
  const fetchStatus = useSelector(selectFetchStatus);
  const loadError = useSelector(selectLoadError);
  const sendError = useSelector(selectSendError);

  useChatBootstrap({ isAuthenticated, fetchStatus });
  useChatSocket({ isAuthenticated, fetchStatus });

  useEffect(() => {
    if (loadError === 'unauthorized' || sendError === 'unauthorized') {
      logout();
    }
  }, [loadError, logout, sendError]);

  return {
    channels,
    currentChannel,
    currentChannelId,
    currentMessages,
    fetchStatus,
    loadError,
  };
};

export default useChat;
