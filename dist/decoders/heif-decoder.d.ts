import { DecodedPicture, PictureDecoder } from '.';
export declare class HeifDecoder implements PictureDecoder {
    private worker;
    decode(file: File): Promise<DecodedPicture>;
    getWorker(): Worker;
}
