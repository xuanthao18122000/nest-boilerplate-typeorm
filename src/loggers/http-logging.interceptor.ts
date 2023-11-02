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
			catchError(error => {
				// Handle and log the error
				this.logger.error({
					message: `\x1b[31m statusCode: ${error.response?.statusCode} # error: ${error.response?.message} # message: ${error.response?.error}\x1b[0m`,
					clientIp: request.ip,
				});
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
