import filter from 'leo-profanity';

const getActiveDictionaries = () => {
  const dictionaryNames = ['en'];

  if ('ru' in filter.wordDictionary) {
    dictionaryNames.push('ru');
  }

  return dictionaryNames;
};

const initializeFilter = () => {
  // Объединяем словари, чтобы фильтр ловил и русскую, и английскую брань.
  const mergedWords = Array.from(
    new Set(getActiveDictionaries().flatMap((dictionaryName) => filter.getDictionary(dictionaryName))),
  );

  filter.clearList();
  filter.add(mergedWords);
};

initializeFilter();

export const sanitizeMessageText = (text) => filter.clean(text);

export const sanitizeChannelName = (text) => filter.clean(text);

export const hasProfanity = (text) => filter.check(text);
