import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import * as fs from 'fs';
import {
  read as xlsxRead,
  readFile as xlsxReadFile,
  stream,
  ParsingOptions,
  Sheet2JSONOpts
} from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export type ReadSheetOptions = {
  parsing?: ParsingOptions
  toJson?: Sheet2JSONOpts
}

export const readSheet = (pathOrArrBuffer: string|ArrayBuffer, sheetName: string, extraOptions?: ReadSheetOptions) => {
  const options = { cellDates: true, raw: true, ...extraOptions?.parsing };
  const wb = (pathOrArrBuffer instanceof ArrayBuffer)
    ? xlsxRead(pathOrArrBuffer, options)
    : xlsxReadFile(pathOrArrBuffer, options);

  const sheet = wb.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`)
  }

  return stream.to_json(sheet, extraOptions?.toJson || {});
}
