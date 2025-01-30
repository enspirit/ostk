import { ParsingOptions } from "xlsx";
import { readSheet } from "../../xlsx";
import { ReadableObjectStream } from "../types";
import { readable } from "./readable";

export const excel = (pathOrArrBuffer: string|ArrayBuffer, sheet: string, options?: ParsingOptions): ReadableObjectStream<Record<PropertyKey, any>> => {
  return readable(readSheet(pathOrArrBuffer, sheet, options));
}
