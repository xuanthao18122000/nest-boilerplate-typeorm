import * as ExcelJS from 'exceljs';

export const setBoldAndColorCellsInRow = (
  worksheet: ExcelJS.Worksheet,
  rowIndex: number,
) => {
  const row = worksheet.getRow(rowIndex);

  return row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1C4587' },
    };
  });
};
