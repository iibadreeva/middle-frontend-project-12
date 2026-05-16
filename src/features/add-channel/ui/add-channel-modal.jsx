import { useRef } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  addNewChannel,
  createChannelNameValidationSchema,
  selectAddChannelStatus,
  selectChannels,
} from '@/entities/chat';
import { ChannelNameModal } from '@/shared/ui/channel-name-modal';

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
      validationSchema={createChannelNameValidationSchema({
        channels,
        shouldFilterProfanity: true,
        t,
      })}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await dispatch(addNewChannel(values.name)).unwrap();
          toast.success(t('toasts.channelCreated'));
          onHide();
        } catch (error) {
          if (error !== 'unauthorized') {
            setStatus(t('errors.addChannelFailed'));
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
        <ChannelNameModal
          show={show}
          title={t('channels.addTitle')}
          value={values.name}
          status={status}
          errors={errors.name}
          touched={touched.name}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          inputId="add-channel-name"
          inputName="name"
          inputRef={inputRef}
          inputAriaLabel={t('channels.channelNameAria')}
          onHide={onHide}
          onEntered={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cancelLabel={t('channels.cancel')}
          submitLabel={t('channels.submit')}
          submittingLabel={t('channels.submitting')}
        />
      )}
    </Formik>
  );
};

export default AddChannelModal;
