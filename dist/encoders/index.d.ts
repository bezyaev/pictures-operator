export type EncodedPicture = {
    blob: Blob;
};
export interface PictureEncoder {
    encode(blob: Blob, targetMimeType: string): Promise<EncodedPicture>;
}
export declare class EncodersFactory {
    static createEncoder(targetFormat: string): PictureEncoder;
}
