import { PictureFormat } from './types';
export type PictureOperatorConfig = {
    format: PictureFormat;
    quality?: number;
    resize?: [number, number];
};
export declare enum PictureOperatorStatus {
    idle = "idle",
    decoding = "decoding",
    compressing = "compressing",
    encoding = "encoding"
}
export declare class PictureOperator {
    private determineMimeType;
    private mimeTypeToFormat;
    private formatToMimeType;
    private supportedEncodeFormats;
    private supportedDecodeFormats;
    private status;
    private activeWorkers;
    terminate(): Promise<void>;
    getStatus: () => PictureOperatorStatus;
    process(file: File, config: PictureOperatorConfig): Promise<Blob>;
    private downloadFile;
}
export { PictureFormat };
