import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import { PictureFormat, PictureOperator } from './distribution.mjs';

const originalWindow = globalThis.window;

beforeEach(() => {
  globalThis.window = {};
});

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
});

test('reports missing browser capabilities clearly', async () => {
  const operator = new PictureOperator();
  const input = new Blob([], { type: 'image/png' });

  await assert.rejects(
    operator.process(input, { format: PictureFormat.jpeg }),
    /Web Workers are not supported/
  );

  globalThis.window.Worker = class {};
  await assert.rejects(
    operator.process(input, { format: PictureFormat.jpeg }),
    /OffscreenCanvas is not supported/
  );
});

test('rejects unsupported output and non-image input before starting workers', async () => {
  globalThis.window.Worker = class {};
  globalThis.window.OffscreenCanvas = class {};

  const operator = new PictureOperator();

  await assert.rejects(
    operator.process(new Blob([], { type: 'image/png' }), {
      format: PictureFormat.gif
    }),
    /Encoding to this format is not supported/
  );
  await assert.rejects(
    operator.process(new Blob([], { type: 'text/plain' }), {
      format: PictureFormat.png
    }),
    /Decoding of this format is not supported/
  );
});
