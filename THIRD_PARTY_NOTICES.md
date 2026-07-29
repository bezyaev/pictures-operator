# Third-party software notices

Pictures Operator's original source code is licensed under the MIT License in `LICENSE`. The published distribution also contains the third-party components below. Those components remain governed by their respective licenses; the MIT license does not replace or limit those terms.

## @jsquash AVIF

- Package: `@jsquash/avif` 1.3.0
- Copyright: Jamie Sinclair and contributors
- Package source: <https://github.com/jamsinclair/jSquash/tree/21ed31e365084044ecdb9c61d851c7e210ef1028>
- Package license: Apache License 2.0 (`licenses/Apache-2.0.txt`)

The included AVIF WebAssembly codecs contain:

- libavif 0.5.4, Copyright 2019 Joe Drago, BSD 2-Clause (`licenses/libavif-BSD-2-Clause.txt`), source: <https://github.com/AOMediaCodec/libavif/tree/v0.5.4>
- libaom 3.1.0, Copyright 2016 Alliance for Open Media, BSD 2-Clause (`licenses/libaom-BSD-2-Clause.txt`), source: <https://aomedia.googlesource.com/aom/+/refs/tags/v3.1.0>

## @jsquash WebP

- Package: `@jsquash/webp` 1.4.0
- Copyright: Jamie Sinclair and contributors
- Package source: <https://github.com/jamsinclair/jSquash/tree/21ed31e365084044ecdb9c61d851c7e210ef1028>
- Package license: Apache License 2.0 (`licenses/Apache-2.0.txt`)

The included WebP WebAssembly codecs contain libwebp 1.0.2, Copyright 2010 Google Inc. and contributors, under the BSD 3-Clause license (`licenses/libwebp-BSD-3-Clause.txt`). Source: <https://chromium.googlesource.com/webm/libwebp/+/v1.0.2>

## libheif-js and libheif

- Package: `libheif-js` 1.17.1
- Package source: <https://github.com/catdad-experiments/libheif-js/tree/d58327650ae188dd1a9b0e8827907ae4bc39dafe>
- Build source: <https://github.com/catdad-experiments/libheif-emscripten/tree/v1.17.1>
- Linked libheif source: <https://github.com/strukturag/libheif/tree/5f12a962f289cba12942287273b87a8f05c93895>
- License: GNU Lesser General Public License 3.0; the complete upstream license file, including the incorporated GPL and MIT texts, is in `licenses/libheif-LGPL-3.0.txt`

The unmodified upstream browser module is distributed as the separate `dist/libheif-bundle.mjs` file. It is loaded at runtime by `dist/heif.worker.js` and can be replaced with an interface-compatible modified build. The application source and build configuration needed to relink a compatible replacement are available in the Pictures Operator source repository at the tag matching the package version.

The SHA-256 digest of the unmodified `libheif-bundle.mjs` from `libheif-js` 1.17.1 is:

```text
e3178bd9e2aa2f34997bbb6195101df4fcc7a35586fcbe2d14d741c3c02ee7f7
```

No warranty is provided for these third-party components. Codec patent rights, if any, are separate from the copyright licenses listed here; no patent license is granted except where an applicable component license expressly provides one.
