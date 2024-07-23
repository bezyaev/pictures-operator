import { EncodedPicture, PictureEncoder } from '.';
import { encode } from '@jsquash/webp';

export class WebpEncoder implements PictureEncoder {
  private worker: Worker | null = null;

  async getImageData(blob: Blob, targetMimeType: string): Promise<ImageData> {
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

        resolve(event.data.imageData);
      };

      this.worker.onerror = (error) => {
        reject(error);
      };

      this.worker.postMessage({
        blob,
        targetMimeType,
        command: 'blob-to-image-data'
      });
    });
  }

  async encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture> {
    const imageData = await this.getImageData(blob, targetMimeType);
    const webpBuffer = await encode(imageData);

    return {
      blob: new Blob([webpBuffer], { type: 'image/webp' })
    };
  }

  getWorker() {
    return this.worker as Worker;
  }
}
