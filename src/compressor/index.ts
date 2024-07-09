export class PictureCompressor {
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
      const worker = new Worker(
        new URL('./compressor.worker.js?worker', import.meta.url),
        {
          type: 'module'
        }
      );

      worker.onmessage = (event) => {
        if (!event.data.success) {
          console.error(event.data);
          reject(new Error(event.data.error));
        }

        resolve(event.data);
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({ blob, quality, targetWidth, targetHeight });
    });
  };
}
