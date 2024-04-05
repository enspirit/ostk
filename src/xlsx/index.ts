import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import * as fs from 'fs';
import {
  readFile as xlsxReadFile,
  stream
} from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export const readFile = (path: string) => {
  return xlsxReadFile(path, {
    cellDates: true
  })
}

export const readSheet = (path: string, sheetName: string) => {
  const wb = readFile(path);
  const sheet = wb.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`)
  }

  return stream.to_json(sheet);
}
