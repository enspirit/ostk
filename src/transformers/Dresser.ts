import { System, Type } from "finitio";
import { Transformer } from "../types";
import { createTransformer } from "./helpers";

export const Dresser = <Output>(schema: System|Type): Transformer<any, Output> => {
  let type: Type;

  if (schema instanceof System) {
    if (!schema.Main) {
      throw new Error('Finitio Schema must have main type');
    }
    type = schema.Main
  } else if (schema instanceof Type) {
    type = schema;
  } else {
    throw new Error(`Finitio Type or Schema expected`);
  }

  return createTransformer(
    async (input: any) => {
      return type.dress(input)
    }
  )
}
