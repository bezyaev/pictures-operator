import { EncodedPicture, PictureEncoder } from '.';
export declare class SimpleEncoder implements PictureEncoder {
    private worker;
    encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
    getWorker(): Worker;
}
