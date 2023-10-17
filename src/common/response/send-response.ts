import { Response } from 'express';

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
}
