# PictureOperator

## Overview

Module to encode, decode, and compress images in various formats directly in the browser using Web workers

### How to use it

```typescript
import { PictureFormat, PictureOperator } from 'pictures-operator';

const pictureOperator = new PictureOperator();

const result = await pictureOperator.process(file, {
  format: PictureFormat.webp, // webp, jpeg, png, avif,
  quality: 90, // quality 0-100
  resize: [720, 480] // width, height
});

// result is a Blob
```

Input formats are: **jpeg, png, bmp, heif, heic, avif, webp**.\
Output formats are: **jpeg, png, avif, webp**.

### Known issues

1. **Vite**

- append in your defineConfig

```
  optimizeDeps: {
    exclude: ["pictures-operator"]
  },
```
