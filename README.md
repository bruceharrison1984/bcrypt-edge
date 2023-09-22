# bcrypt-edge

Implementation of Bcrypt specifically for web workers. This is a best effort conversion from [bcrypt.js](https://github.com/dcodeIO/bcrypt.js). The following difference can be observed:

- All `async` methods have been removed. These don't work in a Web Worker environment, so they were removed.
- Tests are run against the Cloudflare `crypto` compatibility layer via Miniflare

Care was taken to disturb as little as possible with the initial implementation. Essentially I added type information, removed `async` methods, and made sure it could run against the Cloudflare Worker runtime.
