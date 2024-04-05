# OSTk - Object Streams Toolkit

This project aims at helping with the manipulation of [Object Streams](https://nodejs.org/api/stream.html#object-mode) in Node.js, with full type support using TypeScript. OSTk provides a domain-specific language (DSL) that enriches stream processing with robust type completion and error handling, leveraging the power of TypeScript.

The content of the stream is wrapped in `Result<T>` monads, which can be either a `Success<T>` or a `Failure<Error>`, allowing errors to propagate down the pipeline without halting execution.

## Features

* Type-Safe Operations: Enjoy TypeScript's full type completion and error checking throughout your stream processing pipelines.
* Error Propagation: Utilize the `Result<T>` monad to gracefully handle and propagate errors within your stream operations.
* Flexible Stream Manipulation: Use a variety of operators to manipulate object streams easily and intuitively, including grouping, renaming properties, and more.

## Installation

Install OSTk using npm:

```bash
npm install @enspirit/ostk --save
```
Or using yarn:

```bash
yarn add @enspirit/ostk
```
