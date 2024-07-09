(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tslib'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ImageOperator = {}, global.tslib));
})(this, (function (exports, tslib) { 'use strict';

    var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
    class PictureCompressor {
        constructor() {
            this.compress = (_a) => tslib.__awaiter(this, [_a], void 0, function* ({ blob, quality, targetWidth, targetHeight }) {
                return new Promise((resolve, reject) => {
                    const worker = new Worker(new URL('./compressor.worker.js?worker', (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.umd.js', document.baseURI).href))), {
                        type: 'module'
                    });
                    worker.onmessage = (event) => {
                        if (!event.data.success) {
                            console.error(event.data);
                            reject(new Error(event.data.error));
                        }
                        resolve(event.data);
                    };
                    worker.onerror = (error) => {
                        reject(error);
                    };
                    worker.postMessage({ blob, quality, targetWidth, targetHeight });
                });
            });
        }
    }

    exports.PictureFormat = void 0;
    (function (PictureFormat) {
        PictureFormat["gif"] = "gif";
        PictureFormat["heic"] = "heic";
        PictureFormat["heif"] = "heif";
        PictureFormat["webp"] = "webp";
        PictureFormat["jpeg"] = "jpeg";
        PictureFormat["png"] = "png";
        PictureFormat["bmp"] = "bmp";
        PictureFormat["avif"] = "avif";
    })(exports.PictureFormat || (exports.PictureFormat = {}));

    class HeifDecoder {
        decode(file) {
            return tslib.__awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const worker = new Worker(new URL('./heif.worker.js?worker', (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.umd.js', document.baseURI).href))), {
                        type: 'module'
                    });
                    worker.onmessage = (event) => {
                        if (!event.data.success) {
                            reject(new Error(event.data.error));
                        }
                        resolve(event.data);
                    };
                    worker.onerror = (error) => {
                        reject(error);
                    };
                    worker.postMessage({ file, command: 'decode' });
                });
            });
        }
    }

    class SimpleDecoder {
        decode(file) {
            return tslib.__awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const worker = new Worker(new URL('./simple.worker.js?worker', (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.umd.js', document.baseURI).href))), {
                        type: 'module'
                    });
                    worker.onmessage = (event) => {
                        if (!event.data.success) {
                            reject(new Error(event.data.error));
                        }
                        resolve(event.data);
                    };
                    worker.onerror = (error) => {
                        reject(error);
                    };
                    worker.postMessage({ file, command: 'decode' });
                });
            });
        }
    }

    class DecodersFactory {
        static createDecoder(sourceFormat) {
            switch (sourceFormat) {
                case exports.PictureFormat.heic:
                case exports.PictureFormat.heif:
                    return new HeifDecoder();
                default:
                    return new SimpleDecoder();
            }
        }
    }

    class SimpleEncoder {
        encode(blob, targetMimeType) {
            return tslib.__awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const worker = new Worker(new URL('./simple.worker.js?worker', (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.umd.js', document.baseURI).href))), {
                        type: 'module'
                    });
                    worker.onmessage = (event) => {
                        resolve(event.data);
                    };
                    worker.onerror = (error) => {
                        reject(error);
                    };
                    worker.postMessage({ blob, targetMimeType, command: 'encode' });
                });
            });
        }
    }

    class EncodersFactory {
        static createEncoder(targetFormat) {
            switch (targetFormat) {
                default:
                    return new SimpleEncoder();
            }
        }
    }

    class PictureOperator {
        constructor() {
            this.supportedEncodeFormats = [
                exports.PictureFormat.jpeg,
                exports.PictureFormat.png,
                exports.PictureFormat.webp
            ];
        }
        determineMimeType(file) {
            return file.type;
        }
        mimeTypeToFormat(mimeType) {
            switch (mimeType) {
                case 'image/gif':
                    return exports.PictureFormat.gif;
                case 'image/heic':
                    return exports.PictureFormat.heic;
                case 'image/heif':
                    return exports.PictureFormat.heif;
                case 'image/webp':
                    return exports.PictureFormat.webp;
                case 'image/jpeg':
                    return exports.PictureFormat.jpeg;
                case 'image/png':
                    return exports.PictureFormat.png;
                case 'image/bmp':
                    return exports.PictureFormat.bmp;
                case 'image/avif':
                    return exports.PictureFormat.avif;
                default:
                    return exports.PictureFormat.jpeg;
            }
        }
        formatToMimeType(format) {
            switch (format) {
                case exports.PictureFormat.gif:
                    return 'image/gif';
                case exports.PictureFormat.heic:
                    return 'image/heic';
                case exports.PictureFormat.heif:
                    return 'image/heif';
                case exports.PictureFormat.webp:
                    return 'image/webp';
                case exports.PictureFormat.jpeg:
                    return 'image/jpeg';
                case exports.PictureFormat.png:
                    return 'image/png';
                case exports.PictureFormat.bmp:
                    return 'image/bmp';
                case exports.PictureFormat.avif:
                    return 'image/avif';
                default:
                    return 'image/jpeg';
            }
        }
        process(file, config) {
            return tslib.__awaiter(this, void 0, void 0, function* () {
                if (!window.Worker) {
                    throw new Error('Web Workers are not supported in this environment');
                }
                if (!window.OffscreenCanvas) {
                    throw new Error('OffscreenCanvas is not supported in this environment');
                }
                if (!this.supportedEncodeFormats.includes(config.format)) {
                    throw new Error('Encoding to this format is not supported yet');
                }
                const mimeType = this.determineMimeType(file);
                const sourceFormat = this.mimeTypeToFormat(mimeType);
                const [targetWidth, targetHeight] = config.resize;
                const targetFormat = config.format;
                const decoder = DecodersFactory.createDecoder(sourceFormat);
                const decodedPicture = yield decoder.decode(file);
                const pictureCompressor = new PictureCompressor();
                const compressedPicture = yield pictureCompressor.compress({
                    blob: decodedPicture.blob,
                    quality: config.quality,
                    targetWidth,
                    targetHeight
                });
                const encoder = EncodersFactory.createEncoder(targetFormat);
                const targetMimeType = this.formatToMimeType(targetFormat);
                const encodedPicture = yield encoder.encode(compressedPicture.blob, targetMimeType);
                return encodedPicture.blob;
            });
        }
        downloadFile(blob, fileName) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }

    exports.PictureOperator = PictureOperator;

}));
