import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { PictureFormat, PictureOperator, PictureOperatorStatus } from './distribution.mjs';

const originalGlobals = {
  Image: globalThis.Image,
  Worker: globalThis.Worker,
  window: globalThis.window
};

afterEach(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) delete globalThis[name];
    else globalThis[name] = value;
  }
});

test('runs the decode, resize, compress, and encode pipeline', async () => {
  const messages = [];
  const workers = [];

  class FakeImage {
    set src(_value) {
      queueMicrotask(() => this.onerror?.());
    }
  }

  class FakeWorker {
    constructor(url) {
      this.url = String(url);
      this.terminated = false;
      workers.push(this);
    }

    postMessage(message) {
      messages.push(message);
      queueMicrotask(() => {
        if (message.command === 'decode') {
          this.onmessage({
            data: {
              success: true,
              blob: new Blob(['decoded'], { type: 'image/png' }),
              width: 8000,
              height: 2000,
              format: PictureFormat.png
            }
          });
        } else if (this.url.includes('compressor.worker')) {
          this.onmessage({
            data: {
              success: true,
              blob: new Blob(['compressed'], { type: 'image/jpeg' }),
              format: 'jpg'
            }
          });
        } else if (message.command === 'encode') {
          this.onmessage({
            data: {
              success: true,
              blob: new Blob(['encoded'], { type: message.targetMimeType })
            }
          });
        }
      });
    }

    terminate() {
      this.terminated = true;
    }
  }

  globalThis.Image = FakeImage;
  globalThis.Worker = FakeWorker;
  globalThis.window = {
    Worker: FakeWorker,
    OffscreenCanvas: class {}
  };

  const operator = new PictureOperator();
  const output = await operator.process(new Blob(['input'], { type: 'image/png' }), {
    format: PictureFormat.png,
    quality: 80,
    resize: [5000, 1000]
  });

  assert.equal(output.type, 'image/png');
  assert.equal(operator.getStatus(), PictureOperatorStatus.idle);
  assert.deepEqual(
    messages.map(({ command }) => command ?? 'compress'),
    ['decode', 'compress', 'encode']
  );
  assert.deepEqual(
    {
      quality: messages[1].quality,
      targetWidth: messages[1].targetWidth,
      targetHeight: messages[1].targetHeight
    },
    { quality: 80, targetWidth: 4096, targetHeight: 1000 }
  );

  await operator.terminate();
  assert.equal(operator.getStatus(), PictureOperatorStatus.terminated);
  assert.equal(
    workers.every((worker) => worker.terminated),
    true
  );
});
