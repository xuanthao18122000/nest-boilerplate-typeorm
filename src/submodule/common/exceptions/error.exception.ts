import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json(error.getResponse());
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseObject = {
      code: statusCode,
      success: false,
      type: 'ERROR_BACKEND',
      msg: 'Hệ thống đang có vấn đề, thử lại sau!',
    };

    response.status(statusCode).json(responseObject);
  }
}
