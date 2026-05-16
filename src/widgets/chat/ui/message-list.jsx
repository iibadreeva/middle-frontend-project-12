import { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'end' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted chatEmptyState">
        Пока нет сообщений
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 px-4 py-3">
      {messages.map((message) => (
        <div key={message.id} className="text-break">
          <span className="fw-bold me-2">{message.username}</span>
          <span>{message.body}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
