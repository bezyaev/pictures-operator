import { PictureFormat } from '../types';
import { AvifDecoder } from './avif-decoder';
import { HeifDecoder } from './heif-decoder';
import { SimpleDecoder } from './simple-decoder';
import { WebpDecoder } from './webp-decoder';

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
  static isFormatSupported(format: PictureFormat): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();

      let dataUri = '';

      switch (format) {
        case PictureFormat.avif:
          dataUri =
            'AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
          break;
        case PictureFormat.webp:
          dataUri = 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
          break;
        default:
          dataUri = '';
      }

      image.src = `data:image/${format};base64,${dataUri}`;

      image.onload = () => {
        resolve(true);
      };

      image.onerror = () => {
        resolve(false);
      };
    });
  }

  static async createDecoder(
    sourceFormat: PictureFormat
  ): Promise<PictureDecoder> {
    const isFormatSupported = await DecodersFactory.isFormatSupported(
      sourceFormat
    );

    switch (sourceFormat) {
      case PictureFormat.avif:
        return isFormatSupported ? new SimpleDecoder() : new AvifDecoder();
      case PictureFormat.webp:
        return isFormatSupported ? new SimpleDecoder() : new WebpDecoder();
      case PictureFormat.heic:
      case PictureFormat.heif:
        return new HeifDecoder();
      default:
        return new SimpleDecoder();
    }
  }
}
