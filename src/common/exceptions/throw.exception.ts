import { HttpStatus } from '@nestjs/common';
import { ErrorException } from '../response/error-payload.dto';
import statusCode from 'src/configs/status-code.config';

export const throwHttpException = (
  httpStatus: HttpStatus,
  code: string,
): ErrorException => {
  if (statusCode.hasOwnProperty(code)) {
    throw new ErrorException(
      httpStatus,
      statusCode[code].code,
      statusCode[code].type,
      statusCode[code].msg,
    );
  } else {
    throw new Error(`Unknown status code: ${code}`);
  }
};