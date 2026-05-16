import { useRef } from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { addNewChannel, selectAddChannelStatus, selectChannels } from '@/entities/chat';
import { addToast } from '@/shared/model/toasts';

const getValidationSchema = (channels) =>
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
          !channels.some((channel) => channel.name.toLowerCase() === value.trim().toLowerCase()),
      ),
  });

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const addChannelStatus = useSelector(selectAddChannelStatus);
  const inputRef = useRef(null);
  const isLoading = addChannelStatus === 'loading';

  if (!show) {
    return null;
  }

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={getValidationSchema(channels)}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await dispatch(addNewChannel(values.name)).unwrap();
          dispatch(addToast({ title: 'Успешно', message: 'Канал создан' }));
          onHide();
        } catch (error) {
          if (error !== 'unauthorized') {
            setStatus('Не удалось создать канал. Попробуйте еще раз.');
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
      }) => (
        <Modal
          show={show}
          onHide={() => {
            if (!isSubmitting) {
              onHide();
            }
          }}
          onEntered={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Добавить канал</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {status && (
              <Alert variant="danger" className="mb-3">
                {status}
              </Alert>
            )}
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="add-channel-name">
                <Form.Control
                  ref={inputRef}
                  id="add-channel-name"
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
                <Button variant="primary" type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? 'Отправка...' : 'Отправить'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
};

export default AddChannelModal;
