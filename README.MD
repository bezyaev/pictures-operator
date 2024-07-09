# PictureOperator

## Overview

Module to encode, decode, and compress images in various formats directly in the browser using Web workers

### How to use it

```typescript
import { PictureFormat, PictureOperator } from 'pictures-operator';

const pictureOperator = new PictureOperator();

const result = await pictureOperator.process(file, {
  format: PictureFormat.webp, // webp, jpeg, png,
  quality: 90, // quality 0-100
  resize: [720, 480] // width, height
});

// result is a Blob
```

Input formats are: **jpeg, png, bmp, heif, heic**, and **avif**, **webp** (if browser supports it).\
Output formats are: **jpeg, png**, and **webp** (if browser supports it).

### Known issues

1. **Vite**

- append in your defineConfig

```
  optimizeDeps: {
    exclude: ["pictures-operator"]
  },
```

### Roadmap

1. The next versions will include **avif** fallback if the browser does not support it.
