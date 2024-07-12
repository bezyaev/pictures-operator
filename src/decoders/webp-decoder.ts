import { decode } from '@jsquash/webp';
import { DecodedPicture, PictureDecoder } from '.';
import { PictureFormat } from '../types';

export class WebpDecoder implements PictureDecoder {
  async getBlob(imageData: ImageData): Promise<Blob> {
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

        resolve(event.data.blob);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({
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
}
