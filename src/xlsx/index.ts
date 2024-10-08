import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import * as fs from 'fs';
import {
  read as xlsxRead,
  readFile as xlsxReadFile,
  stream
} from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export const readSheet = (pathOrArrBuffer: string|ArrayBuffer, sheetName: string) => {
  const options = { cellDates: true, raw: true };
  const wb = (pathOrArrBuffer instanceof ArrayBuffer)
    ? xlsxRead(pathOrArrBuffer, options)
    : xlsxReadFile(pathOrArrBuffer, options);

  const sheet = wb.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`)
  }

  return stream.to_json(sheet);
}
