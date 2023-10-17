import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 12);
};

export const comparePasswords = (
  password: string,
  passwordHash: string,
) => {
  return bcrypt.compareSync(password, passwordHash);
};
