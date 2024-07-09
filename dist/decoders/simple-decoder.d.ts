import { DecodedPicture, PictureDecoder } from '.';
export declare class SimpleDecoder implements PictureDecoder {
    decode(file: File): Promise<DecodedPicture>;
}
