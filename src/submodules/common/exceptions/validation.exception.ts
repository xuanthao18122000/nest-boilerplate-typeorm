import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | BadRequestException
      | ForbiddenException
      | UnauthorizedException
      | InternalServerErrorException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      code: status,
      success: false,
      msg: exception['response'].message,
      error: exception['response'].error,
    });
  }
}
