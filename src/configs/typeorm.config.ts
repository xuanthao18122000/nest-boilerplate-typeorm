import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { getEnv } from './env.config';

export const dataSourceOptions: DataSourceOptions = {
  type: getEnv('DB_DRIVER'),
  host: getEnv('DB_HOST'),
  port: getEnv('DB_PORT', Number),
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
  logging: true,
  synchronize: true,
  migrationsRun: false,
  entities: [join(__dirname, '..', '/database/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', '/database/migrations/*.{js,ts}')],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
