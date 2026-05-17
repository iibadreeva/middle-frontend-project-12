import { useTranslation } from 'react-i18next'

const ChatHeader = ({ channelName, messageCount }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0 fw-bold chatHeaderTitle text-truncate">
        {t('chat.currentChannel', { name: channelName })}
      </p>
      <span className="text-muted small d-block mt-1">
        {t('chat.messageCount', { count: messageCount })}
      </span>
    </div>
  )
}

export default ChatHeader
