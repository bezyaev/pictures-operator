import { PictureFormat } from '../types';
import { HeifDecoder } from './heif-decoder';
import { SimpleDecoder } from './simple-decoder';

export type DecodedPicture = {
  blob: Blob;
  format: PictureFormat;
  width: number;
  height: number;
};

export interface PictureDecoder {
  decode(file: File): Promise<DecodedPicture>;
}

export class DecodersFactory {
  static createDecoder(sourceFormat: PictureFormat): PictureDecoder {
    switch (sourceFormat) {
      case PictureFormat.heic:
      case PictureFormat.heif:
        return new HeifDecoder();
      default:
        return new SimpleDecoder();
    }
  }
}
