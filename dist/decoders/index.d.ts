import { PictureFormat } from '../types';
export type DecodedPicture = {
    blob: Blob;
    format: PictureFormat;
    width: number;
    height: number;
};
export interface PictureDecoder {
    decode(file: File): Promise<DecodedPicture>;
}
export declare class DecodersFactory {
    static isFormatSupported(format: PictureFormat): Promise<boolean>;
    static createDecoder(sourceFormat: PictureFormat): Promise<PictureDecoder>;
}
