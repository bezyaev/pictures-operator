import { EncodedPicture, PictureEncoder } from '.';
import { encode } from '@jsquash/avif';

export class AvifEncoder implements PictureEncoder {
  async getImageData(blob: Blob, targetMimeType: string): Promise<ImageData> {
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

        resolve(event.data.imageData);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({
        blob,
        targetMimeType,
        command: 'blob-to-image-data'
      });
    });
  }

  async encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture> {
    const imageData = await this.getImageData(blob, targetMimeType);
    const avifBuffer = await encode(imageData);

    return {
      blob: new Blob([avifBuffer], { type: 'image/avif' })
    };
  }
}
