# PictureOperator

## Overview

Module to encode, decode, and compress images in various formats directly in the browser using Web workers

### How to use it

```typescript
import { PictureFormat, PictureOperator } from 'pictures-operator';

const pictureOperator = new PictureOperator();

const result = await pictureOperator.process(file, {
  format: PictureFormat.webp, // webp, jpeg, png, avif
  quality: 90, // quality 0-100
  resize: [720, 480] // width, height
});

// result is a Blob
```

Input formats are: **jpeg, png, bmp, heif, heic**, and **avif**, **webp** (via wasm module).\
Output formats are: **jpeg, png**, and **webp**, **avif** (ia wasm module).

### Known issues

1. **Vite**

- append in your defineConfig

```
  optimizeDeps: {
    exclude: ["pictures-operator"]
  },
```

### Roadmap

1. Check if the browser has native support for AVIF and WebP formats, then use the native encoder/decoder
