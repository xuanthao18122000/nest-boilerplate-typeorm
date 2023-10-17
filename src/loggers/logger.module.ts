import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './http-logging.interceptor';

@Module({
  imports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    Logger,
  ],
})
export class LoggerModule {}
