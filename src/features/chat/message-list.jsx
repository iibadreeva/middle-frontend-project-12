const MessageList = ({ messages }) => {
  if (messages.length === 0) {
    return <div className="chatEmptyState" />;
  }

  return (
    <div className="d-flex flex-column gap-3 px-4 py-3">
      {messages.map((message) => (
        <div key={message.id} className="text-break">
          <span className="fw-bold me-2">{message.username}</span>
          <span>{message.body}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
