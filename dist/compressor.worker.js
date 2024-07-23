var CompressorWorker = (function () {
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
    function main() {
        self.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { blob, quality, targetWidth, targetHeight } } = event;
                const canvas = new OffscreenCanvas(1, 1);
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Could not get 2d context');
                }
                const bitmap = yield createImageBitmap(blob);
                const scaleFactor = Math.max(Math.min(targetWidth, 4096) / bitmap.width, Math.min(targetHeight, 4096) / bitmap.height);
                const downscaleFactor = Math.min(Math.min(targetWidth, 4096) / bitmap.width, Math.min(targetHeight, 4096) / bitmap.height);
                const preCalculatedWidth = bitmap.width * scaleFactor;
                const preCalculatedHeight = bitmap.height * scaleFactor;
                const computedWidth = preCalculatedWidth > 4096 || preCalculatedHeight > 4096
                    ? bitmap.width * downscaleFactor
                    : preCalculatedWidth;
                const computedHeight = preCalculatedWidth > 4096 || preCalculatedHeight > 4096
                    ? bitmap.height * downscaleFactor
                    : preCalculatedHeight;
                canvas.width = computedWidth;
                canvas.height = computedHeight;
                ctx.drawImage(bitmap, 0, 0, computedWidth, computedHeight);
                const resultBlob = yield canvas.convertToBlob({
                    type: 'image/jpeg',
                    quality: quality / 100
                });
                self.postMessage({
                    blob: resultBlob,
                    format: 'jpg',
                    success: true
                });
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
    var compressor_worker = {};

    return compressor_worker;

})();
