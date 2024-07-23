import { DecodedPicture, PictureDecoder } from '.';
export declare class SimpleDecoder implements PictureDecoder {
    private worker;
    decode(file: File): Promise<DecodedPicture>;
    getWorker(): Worker;
}
