import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ChannelSidebar = ({
  channels,
  currentChannelId,
  isReady,
  onOpenAddChannel,
  onOpenRemoveChannel,
  onOpenRenameChannel,
  onSelectChannel,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chat.channels')}</b>
        <Button
          variant="outline-primary"
          className="d-flex align-items-center justify-content-center p-0"
          type="button"
          aria-label={t('chat.addChannelAria')}
          style={{ width: '22px', height: '22px' }}
          onClick={onOpenAddChannel}
          disabled={!isReady}
        >
          +
        </Button>
      </div>
      <div className="overflow-auto chatChannelsList flex-grow-1">
        {channels.map(channel => {
          const isActive = channel.id === currentChannelId
          const variant = isActive ? 'secondary' : 'light'

          if (!channel.removable) {
            return (
              <Button
                key={channel.id}
                variant={variant}
                className={`w-100 mb-1 border-0 shadow-none text-start chatChannelButton ${
                  isActive ? 'text-white' : 'text-dark'
                }`}
                type="button"
                onClick={() => onSelectChannel(channel.id)}
              >
                <span className="d-block text-truncate">{`# ${channel.name}`}</span>
              </Button>
            )
          }

          return (
            <Dropdown as={ButtonGroup} key={channel.id} className="w-100 mb-1 chatChannelGroup">
              <Button
                variant={variant}
                className={`w-100 border-0 shadow-none text-start chatChannelButton ${
                  isActive ? 'text-white' : 'text-dark'
                }`}
                type="button"
                onClick={() => onSelectChannel(channel.id)}
              >
                <span className="d-block text-truncate">{`# ${channel.name}`}</span>
              </Button>
              <Dropdown.Toggle
                split
                variant={variant}
                id={`channel-actions-${channel.id}`}
                className={`border-0 shadow-none chatChannelToggle ${
                  isActive ? 'text-white' : 'text-dark'
                }`}
              >
                <span className="visually-hidden">{t('chat.channelActions', { name: channel.name })}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onOpenRemoveChannel(channel)}>
                  {t('channels.remove')}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onOpenRenameChannel(channel)}>
                  {t('channels.rename')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
        })}
      </div>
    </>
  )
}

export default ChannelSidebar
