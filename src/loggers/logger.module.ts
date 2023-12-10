import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerServiceProvider } from 'src/common/providers/logger.provider';
import { HttpLoggingInterceptor } from './http-logging.interceptor';
import { Logger } from './logger.service';

@Module({
  imports: [LoggerServiceProvider.forRoot()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    Logger,
  ],
})
export class LoggerModule {}
