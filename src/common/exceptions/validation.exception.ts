import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	BadRequestException,
	ForbiddenException,
	UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException, ForbiddenException, UnauthorizedException)
export class ValidationExceptionFilter implements ExceptionFilter {
	catch(exception: BadRequestException | ForbiddenException | UnauthorizedException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		
		response.status(status).json({
			code: status,
			success: false,
			msg: exception['response'].message,
			error: exception['response'].error,
		});
	}

}
