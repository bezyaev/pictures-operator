import { DecodedPicture, PictureDecoder } from '.';

export class SimpleDecoder implements PictureDecoder {
  async decode(file: File): Promise<DecodedPicture> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL('./simple.worker.js?worker', import.meta.url),
        {
          type: 'module'
        }
      );

      worker.onmessage = (event) => {
        if (!event.data.success) {
          reject(new Error(event.data.error));
        }

        resolve(event.data);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({ file, command: 'decode' });
    });
  }
}
