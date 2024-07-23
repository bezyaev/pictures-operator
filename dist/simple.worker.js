var SimpleWorker = (function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // check if the worker is running in a web worker
    if (typeof self !== 'undefined' && typeof window === 'undefined') {
        main();
    }
    function decode(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { file } } = event;
            const canvas = new OffscreenCanvas(1, 1);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get 2d context');
            }
            const blob = new Blob([file], { type: file.type });
            const bitmap = yield createImageBitmap(blob);
            const { width, height } = bitmap;
            // Fallback for iOS, canvas size is limited to 4096x4096
            const downscaleFactor = width > 4096 || height > 4096 ? Math.min(4096 / width, 4096 / height) : 1;
            const scaledWidth = width * downscaleFactor;
            const scaledHeight = height * downscaleFactor;
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);
            const resultBlob = yield canvas.convertToBlob();
            self.postMessage({
                success: true,
                blob: resultBlob,
                format: 'png',
                width,
                height
            });
        });
    }
    function encode(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { blob, targetMimeType } } = event;
            const canvas = new OffscreenCanvas(1, 1);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get 2d context');
            }
            const bitmap = yield createImageBitmap(blob);
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
            const resultBlob = yield canvas.convertToBlob({
                type: targetMimeType
            });
            self.postMessage({
                success: true,
                blob: resultBlob,
                width: bitmap.width,
                height: bitmap.height
            });
        });
    }
    function getImageData(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { blob } } = event;
            const canvas = new OffscreenCanvas(1, 1);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get 2d context');
            }
            const bitmap = yield createImageBitmap(blob);
            const { width, height } = bitmap;
            // Fallback for iOS, canvas size is limited to 4096x4096
            const downscaleFactor = width > 4096 || height > 4096 ? Math.min(4096 / width, 4096 / height) : 1;
            const scaledWidth = width * downscaleFactor;
            const scaledHeight = height * downscaleFactor;
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            ctx.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);
            const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
            self.postMessage({
                success: true,
                imageData: imageData,
                width: scaledWidth,
                height: scaledHeight
            });
        });
    }
    function getBlob(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { imageData } } = event;
            const canvas = new OffscreenCanvas(1, 1);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get 2d context');
            }
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            ctx.putImageData(imageData, 0, 0);
            const blob = yield canvas.convertToBlob();
            self.postMessage({
                success: true,
                blob
            });
        });
    }
    function main() {
        self.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
            const { data: { command } } = event;
            try {
                switch (command) {
                    case 'blob-to-image-data':
                        return getImageData(event);
                    case 'image-data-to-blob':
                        return getBlob(event);
                    case 'decode':
                        return decode(event);
                    case 'encode':
                        return encode(event);
                    default:
                        throw new Error('Unknown command');
                }
            }
            catch (e) {
                self.postMessage({
                    success: false,
                    error: e.message
                });
            }
        });
        self.addEventListener('error', function (event) {
            self.postMessage({ success: false, error: event.message });
        });
    }
    var simple_worker = {};

    return simple_worker;

})();
