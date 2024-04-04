import path from "path";
import { dress, excel, transform } from "../src";
import Finitio from "finitio";

const source = excel(
  path.join(__dirname, '../tests/fixtures/basic.xlsx'),
  'Sheet1',
);

const schema = Finitio.system(`
@import finitio/data

{
  id        :  Numeric
  name      :  String
  country   :? String
  language  :? String
  birthdate :? Date
  ...
}
`)

type Row = {
  id: number,
  name: string,
  country?: string,
  language?: string,
  birthdate?: Date
}

source
  // Dress with finitio
  //
  // See how the original excel contains a mix of dates and strings
  // for the birthdate column
  .pipe(dress<Row>(schema.Main!))
  // Calculate age
  .pipe(transform(async (input) => {
    const today = Date.now();
    const age = input.birthdate
      ? Math.floor((today - input.birthdate?.getTime()) / 3.15576e+10)
      : null;

    return {
      ...input,
      age
    };
  }))
  // Debug
  .pipe(transform(async (input) => {
    console.log('--->', JSON.stringify(input))
    return input;
  }));
