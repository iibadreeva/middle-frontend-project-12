import * as Yup from 'yup'
import { sanitizeChannelName } from './profanity.js'

const createChannelNameValidationSchema = ({
  channels,
  excludedChannelId = null,
  t,
}) => Yup.object({
  name: Yup.string()
    .trim()
    .required(t('validation.required'))
    .min(3, t('validation.channelNameLength'))
    .max(20, t('validation.channelNameLength'))
    .test(
      'unique-channel-name',
      t('validation.uniqueChannelName'),
      value => !value
        || !channels.some(
          channel => channel.id !== excludedChannelId
            && sanitizeChannelName(channel.name).toLowerCase()
            === sanitizeChannelName(value.trim()).toLowerCase(),
        ),
    ),
})

export default createChannelNameValidationSchema
