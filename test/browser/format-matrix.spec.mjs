import { test } from '@playwright/test';

import { expectValidImage, inputMimeTypes, outputMimeTypes, processFixture } from './helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const inputFormat of Object.keys(inputMimeTypes)) {
  for (const [outputFormat, outputMimeType] of Object.entries(outputMimeTypes)) {
    test(`${inputFormat} decodes and encodes as ${outputFormat}`, async ({ page }) => {
      const result = await processFixture(page, { inputFormat, outputFormat });

      expectValidImage(result, { type: outputMimeType });
    });
  }
}
