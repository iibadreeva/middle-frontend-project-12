import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from './chat-slice';

const MessageForm = () => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const sendStatus = useSelector((state) => state.chat.sendStatus);
  const sendError = useSelector((state) => state.chat.sendError);
  const socketStatus = useSelector((state) => state.chat.socketStatus);
  const connectionError = useSelector((state) => state.chat.connectionError);
  const [body, setBody] = useState('');

  const trimmedBody = body.trim();
  const isSubmitDisabled = trimmedBody === '' || !currentChannelId || sendStatus === 'loading';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    try {
      await dispatch(sendMessage(body)).unwrap();
      setBody('');
    } catch (error) {
      // Ошибка уже сохранена в store и показана в интерфейсе.
    }
  };

  return (
    <div>
      {(socketStatus === 'disconnected' || socketStatus === 'error') && connectionError && (
        <Alert variant="warning" className="mb-3 py-2">
          {connectionError}
        </Alert>
      )}
      {sendError && (
        <Alert variant="danger" className="mb-3 py-2">
          {sendError === 'send-failed'
            ? 'Не удалось отправить сообщение. Попробуйте еще раз.'
            : 'Сообщение не отправлено.'}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-group border rounded-2 chatComposerControl">
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Введите сообщение..."
            aria-label="Новое сообщение"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={!currentChannelId || sendStatus === 'loading'}
          />
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn btn-group-vertical border border-1 border-black"
          >
            {sendStatus === 'loading' ? (
              <span className="small px-2">...</span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-arrow-right-square"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                  />
                </svg>
                <span className="visually-hidden">Отправить</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
