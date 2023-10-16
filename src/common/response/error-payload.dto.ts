import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorPayloadDto {
  @ApiProperty() code: number;
  @ApiProperty() msg: string;
  @ApiProperty({ example: false }) success: boolean;
  @ApiProperty({ example: [] }) errors: object;

  constructor({ code, success = false, msg = '', errors = [] }) {
    this.code = code;
    this.success = success;
    this.msg = msg;
    this.errors = errors;
  }
}

export class ErrorException extends HttpException {
  constructor(statusCode, code: number, type: string, msg: string) {
    super({ code, success: false, type, msg }, statusCode);
  }
}
