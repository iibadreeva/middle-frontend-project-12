import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel, selectRemoveChannelStatus } from '@/entities/chat';
import { addToast } from '@/shared/model/toasts';

const RemoveChannelModal = ({ channel, show, onHide }) => {
  const dispatch = useDispatch();
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
      dispatch(addToast({ title: 'Успешно', message: 'Канал удалён' }));
      onHide();
    } catch (requestError) {
      if (requestError !== 'unauthorized') {
        setError('Не удалось удалить канал. Попробуйте еще раз.');
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
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <p className="mb-0">Уверены?</p>
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
          Отменить
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
          {isLoading ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
