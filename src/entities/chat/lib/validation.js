import * as Yup from 'yup';
import { hasProfanity } from './profanity.js';

const createChannelNameValidationSchema = ({
  channels,
  excludedChannelId = null,
  shouldFilterProfanity = false,
  t,
}) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required(t('validation.required'))
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .test(
        'channel-name-without-profanity',
        t('validation.noProfanity'),
        (value) => !shouldFilterProfanity || !value || !hasProfanity(value.trim()),
      )
      .test(
        'unique-channel-name',
        t('validation.uniqueChannelName'),
        (value) =>
          !value ||
          !channels.some(
            (channel) =>
              channel.id !== excludedChannelId &&
              channel.name.toLowerCase() === value.trim().toLowerCase(),
          ),
      ),
  });

export default createChannelNameValidationSchema;
