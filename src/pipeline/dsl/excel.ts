import { readSheet } from "../../xlsx";
import { readable } from "./readable";

export const excel = (path: string, sheet: string) => {
  return readable(readSheet(path, sheet));
}
