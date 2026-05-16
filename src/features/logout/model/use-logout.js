import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  clearSession,
  clearCredentials,
} from '@/entities/session';
import {
  disconnectChatSocket,
  resetChat,
} from '@/entities/chat';

const useLogout = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    disconnectChatSocket();
    clearSession();
    dispatch(clearCredentials());
    dispatch(resetChat());
  }, [dispatch]);
};

export default useLogout;
