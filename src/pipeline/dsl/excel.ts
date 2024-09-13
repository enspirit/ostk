import { readSheet } from "../../xlsx";
import { ReadableObjectStream } from "../types";
import { readable } from "./readable";

export const excel = (pathOrArrBuffer: string|ArrayBuffer, sheet: string): ReadableObjectStream<Record<PropertyKey, any>> => {
  return readable(readSheet(pathOrArrBuffer, sheet));
}
