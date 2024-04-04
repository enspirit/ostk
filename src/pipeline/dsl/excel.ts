import { readSheet } from "../../xlsx";
import { ReadableObjectStream } from "../types";
import { readable } from "./readable";

export const excel = (path: string, sheet: string): ReadableObjectStream<Record<PropertyKey, any>> => {
  return readable(readSheet(path, sheet));
}
