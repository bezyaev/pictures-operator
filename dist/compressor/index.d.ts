export declare class PictureCompressor {
    compress: ({ blob, quality, targetWidth, targetHeight }: {
        blob: Blob;
        quality: number;
        targetWidth: number;
        targetHeight: number;
    }) => Promise<{
        blob: Blob;
        format: string;
    }>;
}
