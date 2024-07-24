import { PictureCompressor } from './compressor';
import { DecodersFactory } from './decoders';
import { EncodersFactory } from './encoders';
import { PictureFormat } from './types';

export type PictureOperatorConfig = {
  format: PictureFormat;
  quality?: number;
  resize?: [number, number];
};

export enum PictureOperatorStatus {
  idle = 'idle',
  decoding = 'decoding',
  compressing = 'compressing',
  encoding = 'encoding',
  terminated = 'terminated'
}

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
    PictureFormat.webp,
    PictureFormat.avif
  ];

  private supportedDecodeFormats = [
    PictureFormat.jpeg,
    PictureFormat.png,
    PictureFormat.webp,
    PictureFormat.heic,
    PictureFormat.heif,
    PictureFormat.bmp,
    PictureFormat.gif,
    PictureFormat.avif
  ];

  private status: PictureOperatorStatus = PictureOperatorStatus.idle;
  private activeWorkers: Worker[] = [];

  private checkTerminated() {
    if (this.status === PictureOperatorStatus.terminated) {
      this.status = PictureOperatorStatus.idle;
      throw new Error('Picture Operator is terminated');
    }
  }

  async terminate() {
    for (const worker of this.activeWorkers) {
      if (worker && worker.terminate) {
        worker.terminate();
      }
    }

    this.activeWorkers = [];
    this.status = PictureOperatorStatus.terminated;
  }

  getStatus = () => this.status;

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

    this.terminate();

    this.status = PictureOperatorStatus.decoding;

    this.checkTerminated();
    const decoder = await DecodersFactory.createDecoder(sourceFormat);
    const decodedPicture = await decoder.decode(file);
    this.activeWorkers.push(decoder.getWorker());

    const targetWidth = config.resize?.[0]
      ? Math.min(config.resize?.[0], 4096)
      : decodedPicture.width;
    const targetHeight = config.resize?.[1]
      ? Math.min(config.resize?.[1], 4096)
      : decodedPicture.height;

    const targetFormat = config.format;

    this.status = PictureOperatorStatus.compressing;
    this.checkTerminated();
    const pictureCompressor = new PictureCompressor();
    const compressedPicture = await pictureCompressor.compress({
      blob: decodedPicture.blob,
      quality: config.quality ?? 100,
      targetWidth,
      targetHeight
    });
    this.activeWorkers.push(pictureCompressor.getWorker());

    this.status = PictureOperatorStatus.encoding;
    const encoder = EncodersFactory.createEncoder(targetFormat);
    const targetMimeType = this.formatToMimeType(targetFormat);

    this.checkTerminated();
    const encodedPicture = await encoder.encode(
      compressedPicture.blob,
      targetMimeType
    );
    this.activeWorkers.push(encoder.getWorker());

    this.status = PictureOperatorStatus.idle;
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
