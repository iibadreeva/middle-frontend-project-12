import { Button } from 'react-bootstrap';

const ChannelSidebar = ({ channels, currentChannelId, onSelectChannel }) => (
  <>
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
      <b>Каналы</b>
      <Button
        variant="outline-primary"
        className="d-flex align-items-center justify-content-center p-0"
        type="button"
        style={{ width: '22px', height: '22px' }}
      >
        +
      </Button>
    </div>
    <div className="overflow-auto chatChannelsList">
      {channels.map((channel) => {
        const isActive = channel.id === currentChannelId;

        return (
          <Button
            key={channel.id}
            variant={isActive ? 'secondary' : 'white'}
            className={`w-100 mb-1 text-start text-truncate border-0 shadow-none chatChannelButton ${
              isActive ? 'text-white' : 'bg-transparent text-dark'
            }`}
            type="button"
            onClick={() => onSelectChannel(channel.id)}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        );
      })}
    </div>
  </>
);

export default ChannelSidebar;
