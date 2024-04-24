import { join } from 'path';
import { LANGUAGE_ENUM } from '../../common/enums';
import { Location } from '../../database/entities';

export const getRelativePathByLang = (lang: LANGUAGE_ENUM, path: string) => {
  if (lang == LANGUAGE_ENUM.VI) {
    return join(__dirname, path);
  }
  return join(__dirname, path);
};

export function getFullAddress(
  province: Location,
  district: Location,
  ward: Location,
  streetNumber: string,
): string {
  return (
    streetNumber +
    ', ' +
    (ward?.name || '') +
    ', ' +
    (district?.name || '') +
    ', ' +
    (province?.name || '')
  );
}
