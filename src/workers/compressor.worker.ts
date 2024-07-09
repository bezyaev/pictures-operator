// check if the worker is running in a web worker
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  main();
}

function main() {
  self.onmessage = async (event: {
    data: {
      blob: Blob;
      quality: number;
      targetWidth: number;
      targetHeight: number;
    };
  }) => {
    try {
      const {
        data: { blob, quality, targetWidth, targetHeight }
      } = event;

      const canvas = new OffscreenCanvas(1, 1);

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get 2d context');
      }

      const bitmap = await createImageBitmap(blob);

      const scaleFactor = Math.max(
        targetWidth / bitmap.width,
        targetHeight / bitmap.height
      );

      const newWidth = bitmap.width * scaleFactor;
      const newHeight = bitmap.height * scaleFactor;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

      const resultBlob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: quality / 100
      });

      self.postMessage({
        blob: resultBlob,
        format: 'jpg',
        success: true
      });
    } catch (e) {
      self.postMessage({
        success: false,
        error: (
          e as {
            message: string;
          }
        ).message
      });
    }
  };

  self.addEventListener('error', function (event) {
    self.postMessage({ success: false, error: event.message });
  });
}

export default {};
