import { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  connectChatSocket,
  hasProfanity,
  selectConnectionError,
  selectCurrentChannelId,
  selectIsChatOnline,
  selectSendError,
  selectSendStatus,
  selectSocketStatus,
  sendMessage,
  socketConnecting,
} from '@/entities/chat'

const MessageForm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const currentChannelId = useSelector(selectCurrentChannelId)
  const sendStatus = useSelector(selectSendStatus)
  const sendError = useSelector(selectSendError)
  const socketStatus = useSelector(selectSocketStatus)
  const isChatOnline = useSelector(selectIsChatOnline)
  const connectionError = useSelector(selectConnectionError)
  const [body, setBody] = useState('')
  const previousConnectionErrorRef = useRef(null)

  const trimmedBody = body.trim()
  const isSubmitDisabled
    = trimmedBody === '' || !currentChannelId || sendStatus === 'loading' || !isChatOnline

  // disconnected → скоро reconnect_attempt; кнопку Retry не показываем.
  const isReconnecting = socketStatus === 'connecting' || socketStatus === 'disconnected'
  // error — автопереподключение исчерпано или первый connect не удался.
  const showConnectionError
    = socketStatus === 'error' && connectionError === 'connection-failed'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    if (hasProfanity(trimmedBody)) {
      toast.warn(t('toasts.messageSanitized'))
    }

    try {
      await dispatch(sendMessage(body)).unwrap()
      setBody('')
    }
    catch (error) {
      if (error) {
        // Ошибка уже сохранена в store и показана в интерфейсе.
      }
    }
  }

  // Toast только при финальной ошибке; при обрыве достаточно баннера reconnecting.
  useEffect(() => {
    if (connectionError && previousConnectionErrorRef.current !== connectionError) {
      if (connectionError === 'connection-failed') {
        toast.error(t('errors.connectionFailed'))
      }
    }

    previousConnectionErrorRef.current = connectionError
  }, [connectionError, t])

  const handleRetryConnection = () => {
    dispatch(socketConnecting())
    const socket = connectChatSocket()
    socket.connect()
  }

  const renderSubmitButtonContent = () => {
    if (sendStatus === 'loading') {
      return <span className="small px-2">...</span>
    }

    return (
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
        <span className="visually-hidden">{t('chat.send')}</span>
      </>
    )
  }

  const renderSendErrorMessage = () => {
    if (sendError === 'send-failed') {
      return t('errors.messageSendFailed')
    }

    if (sendError === 'socket-offline') {
      return t('errors.socketOffline')
    }

    return t('errors.messageNotSent')
  }

  return (
    <div>
      {isReconnecting && (
        <Alert variant="info" className="mb-3 py-2">
          {t('chat.reconnecting')}
        </Alert>
      )}
      {showConnectionError && (
        <Alert
          variant="warning"
          className="mb-3 py-2 d-flex justify-content-between align-items-center"
        >
          <span>{t('errors.connectionFailed')}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={handleRetryConnection}
          >
            {t('chat.retry')}
          </button>
        </Alert>
      )}
      {sendError && sendError !== 'unauthorized' && (
        <Alert variant="danger" className="mb-3 py-2">
          {renderSendErrorMessage()}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-group border rounded-2 chatComposerControl">
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder={t('chat.composerPlaceholder')}
            aria-label={t('chat.composerAria')}
            value={body}
            onChange={event => setBody(event.target.value)}
            disabled={!currentChannelId || sendStatus === 'loading' || !isChatOnline}
          />
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn btn-group-vertical border border-1 border-black"
          >
            {renderSubmitButtonContent()}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm
