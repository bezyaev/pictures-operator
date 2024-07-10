import { EncodedPicture, PictureEncoder } from '.';
export declare class SimpleEncoder implements PictureEncoder {
    encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
}
