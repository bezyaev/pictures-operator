import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

import { chromium } from '@playwright/test';

const root = resolve(process.env.PACKED_CONSUMER_ROOT ?? '');
if (!process.env.PACKED_CONSUMER_ROOT) {
  throw new Error('PACKED_CONSUMER_ROOT is required');
}

const contentTypes = {
  '.avif': 'image/avif',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.wasm': 'application/wasm'
};
const index = `<!doctype html>
<script type="importmap">
  { "imports": { "pictures-operator": "/node_modules/pictures-operator/dist/index.js" } }
</script>`;

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (pathname === '/') {
    response.writeHead(200, { 'Content-Type': contentTypes['.html'] });
    response.end(index);
    return;
  }

  const filePath = resolve(root, pathname.slice(1));
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    response.writeHead(200, {
      'Content-Length': fileStat.size,
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Server did not start');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const requestedAssets = [];
page.on('request', (request) => requestedAssets.push(new URL(request.url()).pathname));

try {
  await page.goto(`http://127.0.0.1:${address.port}/`);
  const result = await page.evaluate(async () => {
    const { PictureFormat, PictureOperator } = await import('pictures-operator');
    const response = await fetch('/input.png');
    const input = new File([await response.blob()], 'input.png', { type: 'image/png' });
    const operator = new PictureOperator();

    try {
      const output = await operator.process(input, {
        format: PictureFormat.avif,
        quality: 80
      });
      const bitmap = await createImageBitmap(output);
      return {
        height: bitmap.height,
        size: output.size,
        type: output.type,
        width: bitmap.width
      };
    } finally {
      await operator.terminate();
    }
  });

  if (
    result.type !== 'image/avif' ||
    result.size <= 0 ||
    result.width !== 8 ||
    result.height !== 6
  ) {
    throw new Error(`Unexpected browser result: ${JSON.stringify(result)}`);
  }
  if (!requestedAssets.some((asset) => asset.endsWith('/simple.worker.js'))) {
    throw new Error('Installed package did not load its worker asset');
  }
  if (!requestedAssets.some((asset) => asset.endsWith('.wasm'))) {
    throw new Error('Installed package did not load a WASM asset');
  }

  console.log('Packed browser consumer passed', result);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
