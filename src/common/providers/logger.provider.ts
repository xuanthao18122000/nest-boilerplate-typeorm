import {
  DynamicModule,
  Global,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { getEnv } from 'src/configs/env.config';
import { LoggerDevService } from 'src/loggers/environments/logger-dev.service';
import { LoggerProductionService } from 'src/loggers/environments/logger-production.service';
import { LoggerStagingService } from 'src/loggers/environments/logger-staging.service ';
import { LoggerTestService } from 'src/loggers/environments/logger-test.service';

@Injectable()
@Global()
export class LoggerServiceProvider {
  static forRoot(): DynamicModule {
    return {
      module: LoggerServiceProvider,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'LoggerService',
          useFactory: () => {
            const env = getEnv('APP_NODE_ENV');
            switch (env) {
              case 'test':
                return new LoggerTestService();
              case 'dev':
                return new LoggerDevService();
              case 'staging':
                return new LoggerStagingService();
              case 'production':
                return new LoggerProductionService();
              default:
                throw new HttpException(
                  'Env must contain [test, dev, staging, production]',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
          },
        },
      ],
      exports: ['LoggerService'],
    };
  }
  error(name: string) {
    throw new Error(`Logger Provider: ${name}`);
  }
}
