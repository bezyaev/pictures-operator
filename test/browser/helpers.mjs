import { expect } from '@playwright/test';

export const inputMimeTypes = {
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp'
};

export const outputMimeTypes = {
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp'
};

export async function processFixture(
  page,
  { inputFormat, outputFormat, forceFallback = false, quality = 80, resize }
) {
  return page.evaluate(
    async ({ inputFormat, inputMimeType, outputFormat, forceFallback, quality, resize }) => {
      const { PictureFormat, PictureOperator } = await import('/dist/index.js');
      const response = await fetch(`/test/fixtures/input.${inputFormat}`);
      if (!response.ok) throw new Error(`Fixture request failed: ${response.status}`);

      const input = new File([await response.blob()], `input.${inputFormat}`, {
        type: inputMimeType
      });
      const operator = new PictureOperator();
      const NativeImage = window.Image;

      if (forceFallback) {
        window.Image = class UnsupportedImage {
          set src(_value) {
            queueMicrotask(() => this.onerror?.(new Event('error')));
          }
        };
      }

      try {
        const output = await operator.process(input, {
          format: PictureFormat[outputFormat],
          quality,
          resize
        });
        const bitmap = await createImageBitmap(output);

        return {
          height: bitmap.height,
          size: output.size,
          status: operator.getStatus(),
          type: output.type,
          width: bitmap.width
        };
      } finally {
        window.Image = NativeImage;
        await operator.terminate();
      }
    },
    {
      inputFormat,
      inputMimeType: inputMimeTypes[inputFormat],
      outputFormat,
      forceFallback,
      quality,
      resize
    }
  );
}

export function expectValidImage(result, { type, width = 8, height = 6 }) {
  expect(result.type).toBe(type);
  expect(result.size).toBeGreaterThan(0);
  expect(result.width).toBe(width);
  expect(result.height).toBe(height);
  expect(result.status).toBe('idle');
}
