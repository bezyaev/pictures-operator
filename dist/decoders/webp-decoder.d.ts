import { DecodedPicture, PictureDecoder } from '.';
export declare class WebpDecoder implements PictureDecoder {
    private worker;
    getBlob(imageData: ImageData): Promise<Blob>;
    decode(file: File): Promise<DecodedPicture>;
    getWorker(): Worker;
}
