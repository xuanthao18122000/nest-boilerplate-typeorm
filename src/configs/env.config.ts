import 'dotenv/config';

export const cfg = (key: string, parser: any = String) =>
  parser(process.env[key]);
