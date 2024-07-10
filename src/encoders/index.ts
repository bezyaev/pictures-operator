import { AvifEncoder } from './avif-encoder';
import { SimpleEncoder } from './simple-encoder';
import { WebpEncoder } from './webp-encoder';

export type EncodedPicture = {
  blob: Blob;
};

export interface PictureEncoder {
  encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
}

export class EncodersFactory {
  static createEncoder(targetFormat: string): PictureEncoder {
    switch (targetFormat) {
      case 'webp':
        return new WebpEncoder();
      case 'avif':
        return new AvifEncoder();
      default:
        return new SimpleEncoder();
    }
  }
}
