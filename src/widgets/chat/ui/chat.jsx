import { Alert, Spinner } from 'react-bootstrap';
import { MessageForm } from '@/features/send-message';
import { useSelectChannel } from '@/features/select-channel';
import useChat from '../model/use-chat.js';
import ChatHeader from './chat-header.jsx';
import ChatLayout from './chat-layout.jsx';
import ChannelSidebar from './channel-sidebar.jsx';
import MessageList from './message-list.jsx';

const Chat = () => {
  const selectChannel = useSelectChannel();
  const {
    channels,
    currentChannel,
    currentChannelId,
    currentMessages,
    fetchStatus,
    loadError,
  } = useChat();

  const renderMessagesContent = () => {
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
          onSelectChannel={selectChannel}
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

export default Chat;
