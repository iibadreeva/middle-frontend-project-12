import { useRef } from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { renameChannel, selectChannels, selectRenameChannelStatus } from '@/entities/chat';
import { addToast } from '@/shared/model/toasts';

const getValidationSchema = (channels, channelId, t) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required(t('validation.required'))
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .test(
        'unique-channel-name',
        t('validation.uniqueChannelName'),
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
  const { t } = useTranslation();
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
      validationSchema={getValidationSchema(channels, channel.id, t)}
      enableReinitialize
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await dispatch(renameChannel({ channelId: channel.id, name: values.name })).unwrap();
          dispatch(
            addToast({ title: t('toasts.successTitle'), message: t('toasts.channelRenamed') }),
          );
          onHide();
        } catch (error) {
          if (error !== 'unauthorized') {
            setStatus(t('errors.renameChannelFailed'));
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
              <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
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
                    aria-label={t('channels.channelNameAria')}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                    {t('channels.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || isLoading || isUnchanged}
                  >
                    {isSubmitting || isLoading ? t('channels.submitting') : t('channels.submit')}
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
