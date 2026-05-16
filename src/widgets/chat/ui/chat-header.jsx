const getMessageCountLabel = (count) => `${count} ${count === 1 ? 'сообщение' : 'сообщений'}`;

const ChatHeader = ({ channelName, messageCount }) => (
  <div className="bg-light mb-4 p-3 shadow-sm small">
    <p className="m-0 fw-bold chatHeaderTitle text-truncate">{`# ${channelName}`}</p>
    <span className="text-muted small d-block mt-1">{getMessageCountLabel(messageCount)}</span>
  </div>
);

export default ChatHeader;
