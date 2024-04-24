import { HttpStatus } from '@nestjs/common';
import statusCode from '../../configs/status-code.config';
import { ErrorException } from '../response/error-payload.dto';

export const ErrorHttpException = (
  httpStatus: HttpStatus,
  code: string,
): ErrorException => {
  if (statusCode.hasOwnProperty(code)) {
    return new ErrorException(
      httpStatus,
      statusCode[code].code,
      statusCode[code].type,
      statusCode[code].msg,
    );
  }
  console.log('🚀 WRONG STATUS CODE:', code, '🚀');
  return new ErrorException(
    httpStatus,
    statusCode['BACKEND'].code,
    statusCode['BACKEND'].type,
    statusCode['BACKEND'].msg,
  );
};
