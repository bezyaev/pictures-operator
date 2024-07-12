import { DecodedPicture, PictureDecoder } from '.';
export declare class WebpDecoder implements PictureDecoder {
    getBlob(imageData: ImageData): Promise<Blob>;
    decode(file: File): Promise<DecodedPicture>;
}
