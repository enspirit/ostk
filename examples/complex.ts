import { group, streamOf, transform, sink, split } from "../src";

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
  {
    id: 4,
    name: 'Qux',
    country: 'be',
    age: 55,
    hobbies: ['Colossal Cave Adventure']
  },
])
// Split by country
.pipe(split({
  spain: {
    matcher: async (input) => input.country === 'es',
    pipeTo: sink(async(input) => console.log('spain', input)),
  },
  france: {
    matcher: async (input) => input.country === 'fr',
    pipeTo: sink(async(input) => console.log('france', input)),
  },
}))
// Records that were not matched by any splitter continue down the pipe
.pipe(sink(async (input: any) => {
  console.log('unmatch record at split level --->', JSON.stringify(input))
}))
