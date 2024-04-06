import { group, streamOf, transform, sink } from "../src";

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
// Group by country (the `group` operator expects the stream to be sorted by these properties)
.pipe(group(['country']))
// Debug
.pipe(sink(async (input: any) => {
  console.log('sink --->', JSON.stringify(input))
}))
