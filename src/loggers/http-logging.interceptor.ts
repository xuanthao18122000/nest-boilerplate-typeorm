import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
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
			message: `${request.method.toUpperCase()} ${request.url}`,
			clientIp: request.ip,
		});

		const now = Date.now();
		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - now;
				this.logger.info(`${request.method.toUpperCase()} ${
          request.url
        } - [${responseTime}ms] - done`);
			}),
			catchError(error => {
				// Handle and log the error
				this.logger.error({
					message: `statusCode: ${error.response?.statusCode} # error: ${error.response?.message} # message: ${error.response?.error}`,
					clientIp: request.ip,
				});
				// Re-throw the error to propagate it to the caller
				return throwError(() => error);
			}),
		);
	}
}
