import { PictureCompressor } from './compressor';
import { DecodersFactory } from './decoders';
import { EncodersFactory } from './encoders';
import { PictureFormat } from './types';

export type PictureOperatorConfig = {
  format: PictureFormat;
  quality?: number;
  resize?: [number, number];
};

export class PictureOperator {
  private determineMimeType(file: File): string {
    return file.type;
  }

  private mimeTypeToFormat(mimeType: string): PictureFormat {
    switch (mimeType) {
      case 'image/gif':
        return PictureFormat.gif;
      case 'image/heic':
        return PictureFormat.heic;
      case 'image/heif':
        return PictureFormat.heif;
      case 'image/webp':
        return PictureFormat.webp;
      case 'image/jpeg':
        return PictureFormat.jpeg;
      case 'image/png':
        return PictureFormat.png;
      case 'image/bmp':
        return PictureFormat.bmp;
      case 'image/avif':
        return PictureFormat.avif;
      default:
        return PictureFormat.jpeg;
    }
  }

  private formatToMimeType(format: PictureFormat): string {
    switch (format) {
      case PictureFormat.gif:
        return 'image/gif';
      case PictureFormat.heic:
        return 'image/heic';
      case PictureFormat.heif:
        return 'image/heif';
      case PictureFormat.webp:
        return 'image/webp';
      case PictureFormat.jpeg:
        return 'image/jpeg';
      case PictureFormat.png:
        return 'image/png';
      case PictureFormat.bmp:
        return 'image/bmp';
      case PictureFormat.avif:
        return 'image/avif';
      default:
        return 'image/jpeg';
    }
  }

  private supportedEncodeFormats = [
    PictureFormat.jpeg,
    PictureFormat.png,
    PictureFormat.webp
  ];

  private supportedDecodeFormats = [
    PictureFormat.jpeg,
    PictureFormat.png,
    PictureFormat.webp,
    PictureFormat.heic,
    PictureFormat.heif,
    PictureFormat.bmp,
    PictureFormat.avif
  ];

  async process(file: File, config: PictureOperatorConfig): Promise<Blob> {
    if (!window.Worker) {
      throw new Error('Web Workers are not supported in this environment');
    }

    if (!window.OffscreenCanvas) {
      throw new Error('OffscreenCanvas is not supported in this environment');
    }

    if (!this.supportedEncodeFormats.includes(config.format)) {
      throw new Error('Encoding to this format is not supported yet');
    }

    const mimeType = this.determineMimeType(file);
    const sourceFormat = this.mimeTypeToFormat(mimeType);

    if (
      !file.type.startsWith('image') ||
      !this.supportedDecodeFormats.includes(sourceFormat)
    ) {
      throw new Error('Decoding of this format is not supported yet');
    }

    const decoder = DecodersFactory.createDecoder(sourceFormat);
    const decodedPicture = await decoder.decode(file);

    const targetWidth = config.resize?.[0] ?? decodedPicture.width;
    const targetHeight = config.resize?.[1] ?? decodedPicture.height;
    const targetFormat = config.format;

    const pictureCompressor = new PictureCompressor();
    const compressedPicture = await pictureCompressor.compress({
      blob: decodedPicture.blob,
      quality: config.quality ?? 100,
      targetWidth,
      targetHeight
    });

    const encoder = EncodersFactory.createEncoder(targetFormat);
    const targetMimeType = this.formatToMimeType(targetFormat);

    const encodedPicture = await encoder.encode(
      compressedPicture.blob,
      targetMimeType
    );

    return encodedPicture.blob;
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export { PictureFormat };
