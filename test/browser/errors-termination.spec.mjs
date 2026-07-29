import { expect, test } from '@playwright/test';

async function processInvalidImage(page, type, bytes) {
  return page.evaluate(
    async ({ type, bytes }) => {
      const { PictureFormat, PictureOperator } = await import('/dist/index.js');
      const operator = new PictureOperator();

      try {
        await operator.process(new File([new Uint8Array(bytes)], 'invalid', { type }), {
          format: PictureFormat.png
        });
        return { rejected: false, status: operator.getStatus() };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : String(error),
          rejected: true,
          status: operator.getStatus()
        };
      } finally {
        await operator.terminate();
      }
    },
    { type, bytes }
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('rejects corrupt PNG input reported by a worker', async ({ page }) => {
  const result = await processInvalidImage(page, 'image/png', [137, 80, 78, 71, 13, 10, 26, 10]);

  expect(result.rejected).toBe(true);
  expect(result.error).toBeTruthy();
  expect(result.status).toBe('idle');
});

test('rejects truncated JPEG input reported by a worker', async ({ page }) => {
  const result = await processInvalidImage(page, 'image/jpeg', [255, 216, 255, 224, 0, 16]);

  expect(result.rejected).toBe(true);
  expect(result.error).toBeTruthy();
  expect(result.status).toBe('idle');
});

test('terminate stops and rejects an active worker operation', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { PictureFormat, PictureOperator } = await import('/dist/index.js');
    const response = await fetch('/test/fixtures/input.png');
    const file = new File([await response.blob()], 'input.png', { type: 'image/png' });
    const NativeWorker = window.Worker;
    let workerStarted;
    const started = new Promise((resolve) => {
      workerStarted = resolve;
    });

    window.Worker = class TrackingWorker {
      constructor(...args) {
        const worker = new NativeWorker(...args);
        workerStarted();
        return worker;
      }
    };

    const operator = new PictureOperator();

    try {
      const processing = operator.process(file, { format: PictureFormat.avif });
      await started;
      await operator.terminate();

      try {
        await processing;
        return { rejected: false, status: operator.getStatus() };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : String(error),
          rejected: true,
          status: operator.getStatus()
        };
      }
    } finally {
      window.Worker = NativeWorker;
    }
  });

  expect(result.rejected).toBe(true);
  expect(result.error).toContain('terminated');
  expect(result.status).toBe('terminated');
});
