import { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  hasProfanity,
  selectConnectionError,
  selectCurrentChannelId,
  selectSendError,
  selectSendStatus,
  selectSocketStatus,
  sendMessage,
} from '@/entities/chat'

const MessageForm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const currentChannelId = useSelector(selectCurrentChannelId)
  const sendStatus = useSelector(selectSendStatus)
  const sendError = useSelector(selectSendError)
  const socketStatus = useSelector(selectSocketStatus)
  const connectionError = useSelector(selectConnectionError)
  const [body, setBody] = useState('')
  const previousConnectionErrorRef = useRef(null)

  const trimmedBody = body.trim()
  const isSubmitDisabled = trimmedBody === '' || !currentChannelId || sendStatus === 'loading'

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
    } catch (error) {
      // Ошибка уже сохранена в store и показана в интерфейсе.
    }
  }

  useEffect(() => {
    if (connectionError && previousConnectionErrorRef.current !== connectionError) {
      if (connectionError === 'connection-lost') {
        toast.warn(t('errors.connectionLost'))
      } else if (connectionError === 'connection-failed') {
        toast.error(t('errors.connectionFailed'))
      }
    }

    previousConnectionErrorRef.current = connectionError
  }, [connectionError, t])

  return (
    <div>
      {(socketStatus === 'disconnected' || socketStatus === 'error') && connectionError && (
        <Alert variant="warning" className="mb-3 py-2">
          {connectionError === 'connection-lost'
            ? t('errors.connectionLost')
            : t('errors.connectionFailed')}
        </Alert>
      )}
      {sendError && sendError !== 'unauthorized' && (
        <Alert variant="danger" className="mb-3 py-2">
          {sendError === 'send-failed' ? t('errors.messageSendFailed') : t('errors.messageNotSent')}
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
                <span className="visually-hidden">{t('chat.send')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm
