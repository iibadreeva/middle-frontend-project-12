import { useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ChatHeader from '../../features/chat/chat-header.jsx';
import ChatLayout from '../../features/chat/chat-layout.jsx';
import ChannelSidebar from '../../features/chat/channel-sidebar.jsx';
import MessageForm from '../../features/chat/message-form.jsx';
import MessageList from '../../features/chat/message-list.jsx';
import { fetchInitialChatData, setCurrentChannel } from '../../features/chat/chat-slice';

const HomePage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const status = useSelector((state) => state.chat.status);
  const error = useSelector((state) => state.chat.error);

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchInitialChatData());
    }
  }, [dispatch, isAuthenticated, status]);

  const currentChannel = channels.find((channel) => channel.id === currentChannelId) || null;
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);
  const renderMessagesContent = () => {
    if (status === 'loading') {
      return (
        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Загрузка данных...</span>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="p-4">
          <Alert variant="danger" className="mb-0">
            {error === 'load-failed'
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
