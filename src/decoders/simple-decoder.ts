import { DecodedPicture, PictureDecoder } from '.';

export class SimpleDecoder implements PictureDecoder {
  private worker: Worker | null = null;

  async decode(file: File): Promise<DecodedPicture> {
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

      this.worker.postMessage({ file, command: 'decode' });
    });
  }

  getWorker() {
    return this.worker as Worker;
  }
}
