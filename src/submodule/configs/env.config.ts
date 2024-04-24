import 'dotenv/config';

export const getEnv = (key: string, parser: any = String) =>
  parser(process.env[key]);
