import { decode } from '@jsquash/avif';
import { DecodedPicture, PictureDecoder } from '.';
import { PictureFormat } from '../types';

export class AvifDecoder implements PictureDecoder {
  private worker: Worker | null = null;

  async getBlob(imageData: ImageData): Promise<Blob> {
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

        resolve(event.data.blob);
      };

      this.worker.onerror = (error) => {
        reject(error);
      };

      this.worker.postMessage({
        imageData,
        command: 'image-data-to-blob'
      });
    });
  }

  async decode(file: File): Promise<DecodedPicture> {
    const arrayBuffer = await file.arrayBuffer();
    const imageData = await decode(arrayBuffer);
    const blob = await this.getBlob(imageData);

    return {
      width: imageData.width,
      height: imageData.height,
      blob,
      format: PictureFormat.png
    };
  }

  getWorker() {
    return this.worker as Worker;
  }
}
