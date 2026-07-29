const entry = process.env.PICTURES_TEST_ENTRY ?? '../../dist/index.js';

export const { PictureFormat, PictureOperator, PictureOperatorStatus } = await import(entry);
