import { SimpleEncoder } from './simple-encoder';

export type EncodedPicture = {
  blob: Blob;
};

export interface PictureEncoder {
  encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
}

export class EncodersFactory {
  static createEncoder(targetFormat: string): PictureEncoder {
    switch (targetFormat) {
      default:
        return new SimpleEncoder();
    }
  }
}
