import { EncodedPicture, PictureEncoder } from '.';
export declare class WebpEncoder implements PictureEncoder {
    private worker;
    getImageData(blob: Blob, targetMimeType: string): Promise<ImageData>;
    encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
    getWorker(): Worker;
}
