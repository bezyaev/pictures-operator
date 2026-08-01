# PicturesOperator

## Overview

PicturesOperator decodes, resizes, compresses, and encodes images directly in the browser using module Web Workers, OffscreenCanvas, and WASM codecs.

It is useful for upload forms, image editors, and other browser tools that need to resize, compress, or convert images before uploading them. Processing happens entirely on the client in Web Workers, reducing unnecessary backend load and keeping heavy work off the main thread.

![PicturesOperator demo](./docs/demo.gif)

The package is ESM-only and requires a browser with Web Worker and OffscreenCanvas support.

## Installation

```bash
npm install pictures-operator
```

## Usage

```typescript
import { PictureFormat, PicturesOperator } from "pictures-operator";

const pictureOperator = new PicturesOperator();

const result = await pictureOperator.process(file, {
  format: PictureFormat.webp,
  quality: 90,
  resize: [720, 480],
});

// result is a Blob
```

Input formats: **JPEG, PNG, BMP, GIF, HEIF, HEIC, AVIF, and WebP**.

Output formats: **JPEG, PNG, AVIF, and WebP**.

`quality` accepts values from 0 to 100. Requested dimensions are limited to 4096 pixels per side.

Call `await pictureOperator.terminate()` to stop an active operation and release its workers.

Files must use one of the documented MIME types. Unknown or empty MIME types are rejected even when they begin with `image/`.

## Browser requirements

PicturesOperator requires all of the following browser features:

- ECMAScript modules and module workers
- Web Workers
- OffscreenCanvas with `convertToBlob()`
- `createImageBitmap()`
- WebAssembly
- `Blob`, `File`, and object URLs

Browser versions are not inferred from user-agent strings. Applications should use feature detection and provide their own fallback UI where these APIs are unavailable.

Classic `<script>` usage is not supported because version 2 is ESM-only and does not expose a global variable. Use an ESM import through a package manager/bundler or a correctly configured module import map.

## Content Security Policy

Workers and codec assets are loaded relative to the package entry. A restrictive application CSP may need directives equivalent to:

```text
script-src 'self' 'wasm-unsafe-eval';
worker-src 'self';
connect-src 'self';
img-src 'self' data: blob:;
```

Adjust origins when package assets are hosted on a CDN. Avoid adding `blob:` to `worker-src` unless the application or bundler actually creates blob workers.

## Migrating from version 1

Version 2 is a breaking, ESM-only release:

- CommonJS `require()` and the UMD entry were removed.
- The package entry is now `dist/index.js` through the package `exports` map.
- Worker and WASM files remain internal package assets and should not be imported directly.
- The published package is self-contained and has no runtime npm dependencies.

Application imports using standard ESM syntax remain unchanged.

## Licensing

Pictures Operator's original code is available under the MIT License. The self-contained browser distribution also includes third-party codec components under Apache-2.0, BSD, and LGPL-3.0 licenses.

See [`LICENSE`](LICENSE) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for the applicable terms, exact versions, notices, and corresponding-source locations. The LGPL-licensed HEIF implementation is shipped as a separate, replaceable `libheif-bundle.mjs` runtime asset.
