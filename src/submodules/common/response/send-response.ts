import { Buffer } from 'exceljs';
import { Response } from 'express';
import * as moment from 'moment';

export class SendResponse {
  static success<T>(data: T, msg = 'Success!') {
    return {
      code: 200,
      success: true,
      data: data,
      msg: msg,
    };
  }

  static downloadExcel(
    stream: Buffer,
    response: Response,
    name: string = 'template',
  ) {
    const timestamp = moment().format('YYYYMMDD-HHmmss');
    const filename = `${name}-${timestamp}`;

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.xlsx`,
    );

    return response.send(stream);
  }
}
