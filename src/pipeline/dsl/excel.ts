import { readSheet } from "../../xlsx";
import { ReadableObjectStream } from "../types";
import { readable } from "./readable";

import { ReadSheetOptions } from "../../xlsx";

export const excel = (pathOrArrBuffer: string|ArrayBuffer, sheet: string, options?: ReadSheetOptions): ReadableObjectStream<Record<PropertyKey, any>> => {
  return readable(readSheet(pathOrArrBuffer, sheet, options));
}
