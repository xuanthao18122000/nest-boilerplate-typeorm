import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from './logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.logger.info({
      message: `\x1b[32m\x1b[33m${request.method.toUpperCase()} ${
        request.url
      }\x1b[0m`,
      clientIp: request.ip,
    });

    const now = Date.now();
    return next.handle().pipe(
      catchError((error) => {
        if (error.response?.message) {
          this.logger.error({
            message: `| \x1b[31m\x1b[31m${request.method.toUpperCase()} ${
              request.route.path
            }\x1b[0m | \x1b[31m StatusCode: ${
              error.response?.statusCode
            } | Type: ${error.response?.error} | Error: ${
              error.response?.message
            }\x1b[0m |`,
            clientIp: request.ip,
          });
        } else {
          this.logger.error({
            message: `| \x1b[31m\x1b[31m${request.method.toUpperCase()} ${
              request.route.path
            }\x1b[0m | \x1b[31m StatusCode: ${error.response?.code} | Type: ${
              error.response?.type
            } | Error: ${error.response?.msg}\x1b[0m |`,
            clientIp: request.ip,
          });
        }

        // Re-throw the error to propagate it to the caller
        return throwError(() => error);
      }),
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.info({
          message: `\x1b[32m\x1b[33m${request.method.toUpperCase()} ${
            request.url
          } - [${responseTime}ms] - DONE\x1b[0m\n`,
          clientIp: request.ip,
        });
      }),
    );
  }
}
