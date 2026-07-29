import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('independent operators process images concurrently', async ({ page }) => {
  const results = await page.evaluate(async () => {
    const { PictureFormat, PictureOperator } = await import('/dist/index.js');
    const response = await fetch('/test/fixtures/input.png');
    const source = await response.blob();
    const operators = [new PictureOperator(), new PictureOperator()];

    try {
      const outputs = await Promise.all([
        operators[0].process(new File([source], 'first.png', { type: 'image/png' }), {
          format: PictureFormat.webp
        }),
        operators[1].process(new File([source], 'second.png', { type: 'image/png' }), {
          format: PictureFormat.avif
        })
      ]);

      return await Promise.all(
        outputs.map(async (output, index) => {
          const bitmap = await createImageBitmap(output);
          return {
            height: bitmap.height,
            size: output.size,
            status: operators[index].getStatus(),
            type: output.type,
            width: bitmap.width
          };
        })
      );
    } finally {
      await Promise.all(operators.map((operator) => operator.terminate()));
    }
  });

  expect(results).toHaveLength(2);
  expect(results.map(({ type }) => type)).toEqual(['image/webp', 'image/avif']);
  for (const result of results) {
    expect(result.size).toBeGreaterThan(0);
    expect(result.width).toBe(8);
    expect(result.height).toBe(6);
    expect(result.status).toBe('idle');
  }
});
