import { DecodedPicture, PictureDecoder } from '.';
export declare class AvifDecoder implements PictureDecoder {
    private worker;
    getBlob(imageData: ImageData): Promise<Blob>;
    decode(file: File): Promise<DecodedPicture>;
    getWorker(): Worker;
}
