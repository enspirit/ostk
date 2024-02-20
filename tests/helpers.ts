import { Stream, Writable } from "stream"

export const waitForEnd = async (stream: Stream) => {
  await new Promise(resolve => {
    stream.on('close', resolve)
    stream.on('error', console.error)
  })
}

export const devNull = () => new Writable({
  objectMode: true,
  write(chunk, enc, cb) {
    console.log('to dev null', chunk)
    cb(null)
  }
})
