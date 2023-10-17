import { Response } from 'express';

export function downloadExcel(name: string, file: Buffer, res: Response) {
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', `attachment; filename=${name}.xlsx`);
  return res.send(file);
}
