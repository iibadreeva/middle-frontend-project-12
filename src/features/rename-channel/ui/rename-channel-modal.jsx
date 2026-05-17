import { useRef } from 'react'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  createChannelNameValidationSchema,
  renameChannel,
  selectChannels,
  selectRenameChannelStatus,
} from '@/entities/chat'
import { ChannelNameModal } from '@/shared/ui/channel-name-modal'

const RenameChannelModal = ({ channel, show, onHide }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const channels = useSelector(selectChannels)
  const renameChannelStatus = useSelector(selectRenameChannelStatus)
  const inputRef = useRef(null)
  const isLoading = renameChannelStatus === 'loading'

  if (!show || !channel) {
    return null
  }

  return (
    <Formik
      initialValues={{ name: channel.name }}
      validationSchema={createChannelNameValidationSchema({
        channels,
        excludedChannelId: channel.id,
        t,
      })}
      enableReinitialize
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null)

        try {
          await dispatch(renameChannel({ channelId: channel.id, name: values.name })).unwrap()
          toast.success(t('toasts.channelRenamed'))
          onHide()
        }
        catch (error) {
          if (error !== 'unauthorized') {
            setStatus(t('errors.renameChannelFailed'))
          }
        }
        finally {
          setSubmitting(false)
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
        const isUnchanged = values.name.trim() === channel.name.trim()

        return (
          <ChannelNameModal
            show={show}
            title={t('channels.renameTitle')}
            value={values.name}
            status={status}
            errors={errors.name}
            touched={touched.name}
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            isSubmitDisabled={isUnchanged}
            inputId="rename-channel-name"
            inputName="name"
            inputRef={inputRef}
            inputAriaLabel={t('channels.channelNameAria')}
            onHide={onHide}
            onEntered={() => {
              if (inputRef.current) {
                inputRef.current.select()
              }
            }}
            onBlur={handleBlur}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cancelLabel={t('channels.cancel')}
            submitLabel={t('channels.submit')}
            submittingLabel={t('channels.submitting')}
          />
        )
      }}
    </Formik>
  )
}

export default RenameChannelModal
