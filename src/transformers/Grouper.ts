import { Failure, Ok, Result, Success, Transformer } from "../types";
import { Path } from "./types";
import { Transform, TransformCallback } from "stream";
import _get from 'lodash/get';

export class GrouperTransformer<Input> extends Transform implements Transformer<Input, Array<Input>> {
  protected group: Array<Input> = []
  protected currentValue?: unknown = undefined;

  constructor(protected path: Path<Input>) {
    super({ objectMode: true });
  }

  private closeGroup() {
    if (this.group.length) {
      this.push(Ok([...this.group]));
    }
    this.group = [];
    this.currentValue = undefined;
  }

  _transform(res: Result<Input>, encoding: BufferEncoding, cb: TransformCallback) {
    super._transform
    if (res instanceof Failure) {
      this.closeGroup();
      this.push(res);
      cb()
      return;
    }

    const input = res.result;
    const value = _get(input, this.path);

    if (this.currentValue === undefined
      || this.currentValue !== value) {
      this.closeGroup();
      this.currentValue = value;
    }
    this.group.push(input);

    cb()
  }

  _flush(callback: TransformCallback): void {
    this.closeGroup();
    callback();
  }
}

export const Grouper = <Input>(path: Path<Input>): Transformer<Input, Array<Input>> => {
  return new GrouperTransformer(path);
}
