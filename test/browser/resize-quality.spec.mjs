import { test } from '@playwright/test';

import { expectValidImage, processFixture } from './helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const quality of [0, 100]) {
  test(`applies resize dimensions at quality ${quality}`, async ({ page }) => {
    const result = await processFixture(page, {
      inputFormat: 'png',
      outputFormat: 'jpeg',
      quality,
      resize: [4, 3]
    });

    expectValidImage(result, { type: 'image/jpeg', width: 4, height: 3 });
  });
}
