# bcrypt-edge

This is an edge/worker conversion for [bcrypt.js](https://github.com/dcodeIO/bcrypt.js).

## Description

Implementation of Bcrypt specifically for web workers. The following differences can be observed from the source library:

- All `async` methods have been removed. These don't work in a Web Worker environment, so they were removed.
  - Perhaps there is some method of re-introducing them, but the originals relied upon `process.nextTick`. Additionally in a worker scenario, theoretically each request is isolated anyway so `async` isn't as impactful.
- Tests are run against the Cloudflare `crypto` compatibility layer via Miniflare

Care was taken to disturb as little as possible with the initial implementation.

Basically, I just added type information, removed `async` methods, and made sure it could run against the Cloudflare Worker runtime.

Unit tests were preserved as best as they could be, with no discrepencies between the original implementation and this one being observed.

## Usage

Usage is similar to the original library, except it's an ESM worker module now and has no `async` methods.

```ts
import {
  genSaltSync,
  hashSync,
  compareSync,
  getRounds,
  getSaltSync,
} from 'bcrypt-edge';

// Hashing
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('B4c0//', salt);

// Create Salt+Hash in one line
const hash = bcrypt.hashSync('bacon', 8);

// Comparing
bcrypt.compareSync('B4c0//', hash); // true
bcrypt.compareSync('not_bacon', hash); // false
```
