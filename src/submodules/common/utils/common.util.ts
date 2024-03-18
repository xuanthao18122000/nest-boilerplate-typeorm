import { join } from 'path';
import { LANGUAGE_ENUM } from '../../common/enums';

export const getRelativePathByLang = (lang: LANGUAGE_ENUM, path: string) => {
  if (lang == LANGUAGE_ENUM.VI) {
    return join(__dirname, path);
  }
  return join(__dirname, path);
};
