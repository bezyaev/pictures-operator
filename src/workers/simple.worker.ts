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

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(bitmap, 0, 0, width, height);

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

function main() {
  self.onmessage = async (event: {
    data: {
      command: 'decode' | 'encode';
      blob: Blob;
      targetMimeType: string;
      file: File;
    };
  }) => {
    const {
      data: { command }
    } = event;

    try {
      return command === 'decode' ? decode(event) : encode(event);
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
