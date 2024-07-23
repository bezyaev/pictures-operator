import { EncodedPicture, PictureEncoder } from '.';

export class SimpleEncoder implements PictureEncoder {
  private worker: Worker | null = null;

  async encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture> {
    return new Promise((resolve, reject) => {
      this.worker = new Worker(
        new URL('./simple.worker.js?worker', import.meta.url),
        {
          type: 'module'
        }
      );

      this.worker.onmessage = (event) => {
        if (!event.data.success) {
          reject(new Error(event.data.error));
        }

        resolve(event.data);
      };

      this.worker.onerror = (error) => {
        reject(error);
      };

      this.worker.postMessage({ blob, targetMimeType, command: 'encode' });
    });
  }

  getWorker() {
    return this.worker as Worker;
  }
}
