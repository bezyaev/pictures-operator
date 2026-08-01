import { test } from '@playwright/test';

import { expectValidImage, processFixture } from './helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const inputFormat of ['webp', 'avif']) {
  test(`${inputFormat} WASM fallback decoder works`, async ({ page }) => {
    const result = await processFixture(page, {
      inputFormat,
      outputFormat: 'png',
      forceFallback: true
    });

    expectValidImage(result, { type: 'image/png' });
  });
}
