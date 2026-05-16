import { useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ChatHeader from '../../features/chat/chat-header.jsx';
import ChatLayout from '../../features/chat/chat-layout.jsx';
import ChannelSidebar from '../../features/chat/channel-sidebar.jsx';
import MessageForm from '../../features/chat/message-form.jsx';
import MessageList from '../../features/chat/message-list.jsx';
import {
  fetchInitialChatData,
  messageReceived,
  setCurrentChannel,
  socketConnected,
  socketDisconnected,
  socketErrored,
} from '../../features/chat/chat-slice';
import { connectChatSocket, disconnectChatSocket } from '../../features/chat/chat-socket';

const HomePage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const fetchStatus = useSelector((state) => state.chat.fetchStatus);
  const loadError = useSelector((state) => state.chat.loadError);

  // Инициализируем чат один раз после входа или восстановления сессии.
  useEffect(() => {
    if (isAuthenticated && fetchStatus === 'idle') {
      dispatch(fetchInitialChatData());
    }
  }, [dispatch, fetchStatus, isAuthenticated]);

  // Держим socket-подписки рядом со страницей чата, чтобы при выходе со страницы
  // или разлогине все listeners и соединение гарантированно очищались.
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

  const currentChannel = channels.find((channel) => channel.id === currentChannelId) || null;
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);

  const renderMessagesContent = () => {
    // Правая колонка переключается между загрузкой, ошибкой и лентой сообщений.
    if (fetchStatus === 'loading') {
      return (
        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Загрузка данных...</span>
        </div>
      );
    }

    if (fetchStatus === 'failed') {
      return (
        <div className="p-4">
          <Alert variant="danger" className="mb-0">
            {loadError === 'load-failed'
              ? 'Не удалось загрузить данные чата.'
              : 'Произошла ошибка при загрузке чата.'}
          </Alert>
        </div>
      );
    }

    return <MessageList messages={currentMessages} />;
  };

  return (
    <ChatLayout
      sidebar={(
        <ChannelSidebar
          channels={channels}
          currentChannelId={currentChannelId}
          onSelectChannel={(channelId) => dispatch(setCurrentChannel(channelId))}
        />
      )}
      header={(
        <ChatHeader
          channelName={currentChannel ? currentChannel.name : 'general'}
          messageCount={currentMessages.length}
        />
      )}
      messages={renderMessagesContent()}
      composer={<MessageForm />}
    />
  );
};

export default HomePage;
