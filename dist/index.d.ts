import { PictureFormat } from './types';
export type PictureOperatorConfig = {
    format: PictureFormat;
    quality: number;
    resize: [number, number];
};
export declare class PictureOperator {
    private determineMimeType;
    private mimeTypeToFormat;
    private formatToMimeType;
    private supportedEncodeFormats;
    process(file: File, config: PictureOperatorConfig): Promise<Blob>;
    private downloadFile;
}
export { PictureFormat };
