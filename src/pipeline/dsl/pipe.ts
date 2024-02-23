import { Transformer } from "../../transformers";
import { PipeDestination, ReadableObjectStream } from "../types";

export const pipe = <I, T extends PipeDestination<I>>(
  stream: ReadableObjectStream<I>,
  destination: T
): T => {
  if (destination instanceof Transformer) {
    return stream.pipe(
      // @ts-ignore
      wrap(destination)
    ) as T
  }

  return stream.pipe(destination) as T;
}

