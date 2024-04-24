import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorPayloadDto {
  @ApiProperty() code: number;
  @ApiProperty() msg: string;
  @ApiProperty({ example: false }) success: boolean;

  constructor({ code = 0, success = false, msg = '' }) {
    this.code = code;
    this.success = success;
    this.msg = msg;
  }
}

export class ErrorException extends HttpException {
  constructor(statusCode: HttpStatus, code: number, type: string, msg: string) {
    super({ code, success: false, type, msg }, statusCode);
  }
}
