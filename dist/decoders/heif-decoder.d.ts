import { DecodedPicture, PictureDecoder } from '.';
export declare class HeifDecoder implements PictureDecoder {
    decode(file: File): Promise<DecodedPicture>;
}
