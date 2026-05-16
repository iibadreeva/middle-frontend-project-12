import { useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { AddChannelModal } from '@/features/add-channel';
import { RemoveChannelModal } from '@/features/remove-channel';
import { RenameChannelModal } from '@/features/rename-channel';
import { MessageForm } from '@/features/send-message';
import { useSelectChannel } from '@/features/select-channel';
import useChat from '../model/use-chat.js';
import ChatHeader from './chat-header.jsx';
import ChatLayout from './chat-layout.jsx';
import ChannelSidebar from './channel-sidebar.jsx';
import MessageList from './message-list.jsx';

const Chat = () => {
  const selectChannel = useSelectChannel();
  const [modalState, setModalState] = useState({ type: null, channel: null });
  const { channels, currentChannel, currentChannelId, currentMessages, fetchStatus, loadError } =
    useChat();

  const closeModal = () => {
    setModalState({ type: null, channel: null });
  };

  const openAddChannelModal = () => {
    setModalState({ type: 'add', channel: null });
  };

  const openRenameChannelModal = (channel) => {
    setModalState({ type: 'rename', channel });
  };

  const openRemoveChannelModal = (channel) => {
    setModalState({ type: 'remove', channel });
  };

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
    <>
      <ChatLayout
        sidebar={
          <ChannelSidebar
            channels={channels}
            currentChannelId={currentChannelId}
            isReady={fetchStatus === 'succeeded'}
            onOpenAddChannel={openAddChannelModal}
            onOpenRemoveChannel={openRemoveChannelModal}
            onOpenRenameChannel={openRenameChannelModal}
            onSelectChannel={selectChannel}
          />
        }
        header={
          <ChatHeader
            channelName={currentChannel ? currentChannel.name : 'general'}
            messageCount={currentMessages.length}
          />
        }
        messages={renderMessagesContent()}
        composer={<MessageForm />}
      />
      <AddChannelModal show={modalState.type === 'add'} onHide={closeModal} />
      <RenameChannelModal
        show={modalState.type === 'rename'}
        channel={modalState.channel}
        onHide={closeModal}
      />
      <RemoveChannelModal
        show={modalState.type === 'remove'}
        channel={modalState.channel}
        onHide={closeModal}
      />
    </>
  );
};

export default Chat;
