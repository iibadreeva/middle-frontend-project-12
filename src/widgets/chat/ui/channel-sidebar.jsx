import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

const ChannelSidebar = ({
  channels,
  currentChannelId,
  isReady,
  onOpenAddChannel,
  onOpenRemoveChannel,
  onOpenRenameChannel,
  onSelectChannel,
}) => (
  <>
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
      <b>Каналы</b>
      <Button
        variant="outline-primary"
        className="d-flex align-items-center justify-content-center p-0"
        type="button"
        aria-label="Добавить канал"
        style={{ width: '22px', height: '22px' }}
        onClick={onOpenAddChannel}
        disabled={!isReady}
      >
        +
      </Button>
    </div>
    <div className="overflow-auto chatChannelsList flex-grow-1">
      {channels.map((channel) => {
        const isActive = channel.id === currentChannelId;
        const variant = isActive ? 'secondary' : 'light';

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
          );
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
              aria-label={`Управление каналом ${channel.name}`}
            />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onOpenRemoveChannel(channel)}>Удалить</Dropdown.Item>
              <Dropdown.Item onClick={() => onOpenRenameChannel(channel)}>
                Переименовать
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      })}
    </div>
  </>
);

export default ChannelSidebar;
