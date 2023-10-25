import { Response } from 'express';
import { Buffer } from 'exceljs';

export class SendResponse {
  static success<T>(data: T, msg = '', res: Response = null) {
    if (res) {
      return res.send({
        code: 200,
        success: true,
        data: data,
        msg: msg,
      });
    }
    return {
      code: 200,
      success: true,
      data: data,
      msg: msg,
    };
  }

  static downloadExcel(name: string, fileBuffer: Buffer, response: Response) {
    const file = Buffer.from(fileBuffer);
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${name}.xlsx`,
    );
    return response.send(file);
  }
}
