import { EncodedPicture, PictureEncoder } from '.';
export declare class AvifEncoder implements PictureEncoder {
    getImageData(blob: Blob, targetMimeType: string): Promise<ImageData>;
    encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
}
