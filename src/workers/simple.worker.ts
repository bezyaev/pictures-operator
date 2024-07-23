// check if the worker is running in a web worker
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  main();
}

async function decode(event: {
  data: {
    file: File;
  };
}) {
  const {
    data: { file }
  } = event;

  const canvas = new OffscreenCanvas(1, 1);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context');
  }

  const blob = new Blob([file], { type: file.type });
  const bitmap = await createImageBitmap(blob);

  const { width, height } = bitmap;

  // Fallback for iOS, canvas size is limited to 4096x4096
  const downscaleFactor =
    width > 4096 || height > 4096 ? Math.min(4096 / width, 4096 / height) : 1;

  const scaledWidth = width * downscaleFactor;
  const scaledHeight = height * downscaleFactor;

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);

  const resultBlob = await canvas.convertToBlob();

  self.postMessage({
    success: true,
    blob: resultBlob,
    format: 'png',
    width,
    height
  });
}

async function encode(event: {
  data: {
    blob: Blob;
    targetMimeType: string;
  };
}) {
  const {
    data: { blob, targetMimeType }
  } = event;

  const canvas = new OffscreenCanvas(1, 1);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context');
  }

  const bitmap = await createImageBitmap(blob);

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

  const resultBlob = await canvas.convertToBlob({
    type: targetMimeType
  });

  self.postMessage({
    success: true,
    blob: resultBlob,
    width: bitmap.width,
    height: bitmap.height
  });
}

async function getImageData(event: {
  data: {
    blob: Blob;
  };
}) {
  const {
    data: { blob }
  } = event;

  const canvas = new OffscreenCanvas(1, 1);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context');
  }

  const bitmap = await createImageBitmap(blob);

  const { width, height } = bitmap;

  // Fallback for iOS, canvas size is limited to 4096x4096
  const downscaleFactor =
    width > 4096 || height > 4096 ? Math.min(4096 / width, 4096 / height) : 1;

  const scaledWidth = width * downscaleFactor;
  const scaledHeight = height * downscaleFactor;

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);

  const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);

  self.postMessage({
    success: true,
    imageData: imageData,
    width: scaledWidth,
    height: scaledHeight
  });
}

async function getBlob(event: {
  data: {
    imageData: ImageData;
  };
}) {
  const {
    data: { imageData }
  } = event;

  const canvas = new OffscreenCanvas(1, 1);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context');
  }

  canvas.width = imageData.width;
  canvas.height = imageData.height;

  ctx.putImageData(imageData, 0, 0);
  const blob = await canvas.convertToBlob();

  self.postMessage({
    success: true,
    blob
  });
}

function main() {
  self.onmessage = async (event: {
    data: {
      command:
        | 'decode'
        | 'encode'
        | 'blob-to-image-data'
        | 'image-data-to-blob';
      blob: Blob;
      targetMimeType: string;
      file: File;
      imageData: ImageData;
    };
  }) => {
    const {
      data: { command }
    } = event;

    try {
      switch (command) {
        case 'blob-to-image-data':
          return getImageData(event);
        case 'image-data-to-blob':
          return getBlob(event);
        case 'decode':
          return decode(event);
        case 'encode':
          return encode(event);
        default:
          throw new Error('Unknown command');
      }
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
