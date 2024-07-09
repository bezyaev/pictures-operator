import { EncodedPicture, PictureEncoder } from '.';

export class SimpleEncoder implements PictureEncoder {
  async encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL('./simple.worker.js?worker', import.meta.url),
        {
          type: 'module'
        }
      );

      worker.onmessage = (event) => {
        resolve(event.data);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({ blob, targetMimeType, command: 'encode' });
    });
  }
}
