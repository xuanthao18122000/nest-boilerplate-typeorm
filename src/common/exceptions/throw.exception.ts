import { HttpStatus } from '@nestjs/common';
import { ErrorException } from '../response/error-payload.dto';
import statusCode from 'src/configs/status-code.config';

export const throwHttpException = (
  httpStatus: HttpStatus,
  code: string,
): ErrorException => {
  throw new ErrorException(
    httpStatus,
    statusCode[code].code,
    statusCode[code].type,
    statusCode[code].msg,
  );
};
