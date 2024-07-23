export class PictureCompressor {
  private worker: Worker | null = null;

  compress = async ({
    blob,
    quality,
    targetWidth,
    targetHeight
  }: {
    blob: Blob;
    quality: number;
    targetWidth: number;
    targetHeight: number;
  }): Promise<{
    blob: Blob;
    format: string;
  }> => {
    return new Promise((resolve, reject) => {
      this.worker = new Worker(
        new URL('./compressor.worker.js?worker', import.meta.url),
        {
          type: 'module'
        }
      );

      this.worker.onmessage = (event) => {
        if (!event.data.success) {
          console.error(event.data);
          reject(new Error(event.data.error));
        }

        resolve(event.data);
      };

      this.worker.onerror = (error) => {
        reject(error);
      };

      this.worker.postMessage({ blob, quality, targetWidth, targetHeight });
    });
  };

  getWorker = () => {
    return this.worker as Worker;
  };
}
