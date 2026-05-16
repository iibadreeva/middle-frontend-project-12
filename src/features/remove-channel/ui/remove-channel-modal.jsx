import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { removeChannel, selectRemoveChannelStatus } from '@/entities/chat';

const RemoveChannelModal = ({ channel, show, onHide }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const removeChannelStatus = useSelector(selectRemoveChannelStatus);
  const [error, setError] = useState(null);
  const isLoading = removeChannelStatus === 'loading';

  if (!show || !channel) {
    return null;
  }

  const handleRemove = async () => {
    setError(null);

    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      toast.success(t('toasts.channelRemoved'));
      onHide();
    } catch (requestError) {
      if (requestError !== 'unauthorized') {
        setError(t('errors.removeChannelFailed'));
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        if (!isLoading) {
          setError(null);
          onHide();
        }
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.removeTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <p className="mb-0">{t('channels.confirmRemove')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setError(null);
            onHide();
          }}
          disabled={isLoading}
        >
          {t('channels.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
          {isLoading ? t('channels.removing') : t('channels.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
