import { group, streamOf, transform } from "../src";
import { useSink } from "../tests/pipeline/helpers";

const sink = useSink<any>().stream

streamOf(...[
  {
    id: 1,
    name: 'Foo',
    country: 'es',
    age: 10,
    hobbies: ['footbal']
  },
  {
    id: 2,
    name: 'Bar',
    country: 'es',
    age: 20,
    hobbies: ['footbal', 'literature']
  },
  {
    id: 3,
    name: 'Baz',
    country: 'fr',
    age: 30,
    hobbies: ['literature', 'chess']
  },
])
// Add a constnat
.pipe(transform(async (input) => {
  return {
    ...input,
    constant: 42,
  };
}))
// Debug
.pipe(transform(async (input) => {
  console.log('--->', JSON.stringify(input))
  return input;
}))
