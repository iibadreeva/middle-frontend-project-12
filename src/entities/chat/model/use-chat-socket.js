import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectChatSocket, disconnectChatSocket } from '../api/chat-socket.js';
import {
  messageReceived,
  socketConnected,
  socketDisconnected,
  socketErrored,
} from './slice.js';

const useChatSocket = ({ isAuthenticated, fetchStatus }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || fetchStatus !== 'succeeded') {
      return undefined;
    }

    const socket = connectChatSocket();

    const handleNewMessage = (message) => {
      dispatch(messageReceived(message));
    };
    const handleConnect = () => {
      dispatch(socketConnected());
    };
    const handleDisconnect = () => {
      dispatch(socketDisconnected());
    };
    const handleConnectError = () => {
      dispatch(socketErrored());
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    if (socket.connected) {
      dispatch(socketConnected());
    }

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      disconnectChatSocket();
    };
  }, [dispatch, fetchStatus, isAuthenticated]);
};

export default useChatSocket;
