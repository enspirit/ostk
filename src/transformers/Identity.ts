import { System, Type } from "finitio";
import { Err, Ok, Processor } from "../types";
import { createTransformer } from "./helpers";

export const Identity = createTransformer(async (input: unknown) => {
  return input
})
