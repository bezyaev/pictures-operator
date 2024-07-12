import { DecodedPicture, PictureDecoder } from '.';
export declare class AvifDecoder implements PictureDecoder {
    getBlob(imageData: ImageData): Promise<Blob>;
    decode(file: File): Promise<DecodedPicture>;
}
