import { HeifDecoder } from 'libheif-js';

// check if the worker is running in a web worker
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  main();
}

async function decode(event: {
  data: {
    file: Blob;
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

  const decoder = new HeifDecoder();
  const fileBuffer = await file.arrayBuffer();

  const data = await decoder.decode(fileBuffer);

  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);

  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      resolve(1);
    });
  });

  ctx.putImageData(imageData, 0, 0);

  const blob = await canvas.convertToBlob();

  self.postMessage({
    success: true,
    blob,
    width,
    height,
    format: 'png'
  });
}

function main() {
  self.onmessage = async (event: {
    data: {
      file: Blob;
      command: 'decode' | 'encode';
    };
  }) => {
    const {
      data: { command }
    } = event;

    try {
      return command === 'decode' ? decode(event) : null;
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
