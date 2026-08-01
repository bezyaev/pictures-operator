import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PictureFormat, PicturesOperator, PictureOperatorStatus } from './distribution.mjs';

test('exports the documented formats and starts idle', () => {
  const operator = new PicturesOperator();

  assert.equal(operator.getStatus(), PictureOperatorStatus.idle);
  assert.equal(PictureFormat.jpeg, 'jpeg');
  assert.equal(PictureFormat.webp, 'webp');
  assert.equal(PictureFormat.avif, 'avif');
});
