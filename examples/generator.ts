import { Readable } from "stream";
import { readable, sink, transform } from "../src";
import { useSink } from "../tests/pipeline/helpers";

/**
 * This example shows how one can produce easily an object stream
 * from a generator function, and how the back pressure is handled properly
 * by node
 */
const asyncIterator = (async function* () {
  let i = 0;
  while (true) {
    const item = { n: i++ };
    console.log('producing', item);
    yield item;
  }
})();

const stream = readable<{n: number}>(Readable.from(asyncIterator));

stream
  .pipe(sink(async (input: any) => {
    await new Promise((resolve) => {
      console.log('sink', input);
      setTimeout(resolve, 300);
    })
  }))
