import { useRef } from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { renameChannel, selectChannels, selectRenameChannelStatus } from '@/entities/chat';
import { addToast } from '@/shared/model/toasts';

const getValidationSchema = (channels, channelId) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .test(
        'unique-channel-name',
        'Должно быть уникальным',
        (value) =>
          !value ||
          !channels.some(
            (channel) =>
              channel.id !== channelId && channel.name.toLowerCase() === value.trim().toLowerCase(),
          ),
      ),
  });

const RenameChannelModal = ({ channel, show, onHide }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const renameChannelStatus = useSelector(selectRenameChannelStatus);
  const inputRef = useRef(null);
  const isLoading = renameChannelStatus === 'loading';

  if (!show || !channel) {
    return null;
  }

  return (
    <Formik
      initialValues={{ name: channel.name }}
      validationSchema={getValidationSchema(channels, channel.id)}
      enableReinitialize
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await dispatch(renameChannel({ channelId: channel.id, name: values.name })).unwrap();
          dispatch(addToast({ title: 'Успешно', message: 'Канал переименован' }));
          onHide();
        } catch (error) {
          if (error !== 'unauthorized') {
            setStatus('Не удалось переименовать канал. Попробуйте еще раз.');
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        status,
      }) => {
        const isUnchanged = values.name.trim() === channel.name.trim();

        return (
          <Modal
            show={show}
            onHide={() => {
              if (!isSubmitting) {
                onHide();
              }
            }}
            onEntered={() => {
              if (inputRef.current) {
                inputRef.current.select();
              }
            }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Переименовать канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {status && (
                <Alert variant="danger" className="mb-3">
                  {status}
                </Alert>
              )}
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="rename-channel-name">
                  <Form.Control
                    ref={inputRef}
                    id="rename-channel-name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && Boolean(errors.name)}
                    disabled={isSubmitting}
                    autoComplete="off"
                    aria-label="Имя канала"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                    Отменить
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || isLoading || isUnchanged}
                  >
                    {isSubmitting || isLoading ? 'Отправка...' : 'Отправить'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default RenameChannelModal;
