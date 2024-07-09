import{__awaiter as e}from"tslib";class r{constructor(){this.compress=r=>e(this,[r],void 0,(function*({blob:e,quality:r,targetWidth:t,targetHeight:o}){return new Promise(((i,n)=>{const s=new Worker(new URL("./compressor.worker.js?worker",import.meta.url),{type:"module"});s.onmessage=e=>{e.data.success||(console.error(e.data),n(new Error(e.data.error))),i(e.data)},s.onerror=e=>{n(e)},s.postMessage({blob:e,quality:r,targetWidth:t,targetHeight:o})}))}))}}var t;!function(e){e.gif="gif",e.heic="heic",e.heif="heif",e.webp="webp",e.jpeg="jpeg",e.png="png",e.bmp="bmp",e.avif="avif"}(t||(t={}));class o{decode(r){return e(this,void 0,void 0,(function*(){return new Promise(((e,t)=>{const o=new Worker(new URL("./heif.worker.js?worker",import.meta.url),{type:"module"});o.onmessage=r=>{r.data.success||t(new Error(r.data.error)),e(r.data)},o.onerror=e=>{t(e)},o.postMessage({file:r,command:"decode"})}))}))}}class i{decode(r){return e(this,void 0,void 0,(function*(){return new Promise(((e,t)=>{const o=new Worker(new URL("./simple.worker.js?worker",import.meta.url),{type:"module"});o.onmessage=r=>{r.data.success||t(new Error(r.data.error)),e(r.data)},o.onerror=e=>{t(e)},o.postMessage({file:r,command:"decode"})}))}))}}class n{static createDecoder(e){switch(e){case t.heic:case t.heif:return new o;default:return new i}}}class s{encode(r,t){return e(this,void 0,void 0,(function*(){return new Promise(((e,o)=>{const i=new Worker(new URL("./simple.worker.js?worker",import.meta.url),{type:"module"});i.onmessage=r=>{e(r.data)},i.onerror=e=>{o(e)},i.postMessage({blob:r,targetMimeType:t,command:"encode"})}))}))}}class a{static createEncoder(e){return new s}}class c{constructor(){this.supportedEncodeFormats=[t.jpeg,t.png,t.webp],this.supportedDecodeFormats=[t.jpeg,t.png,t.webp,t.heic,t.heif,t.bmp,t.avif]}determineMimeType(e){return e.type}mimeTypeToFormat(e){switch(e){case"image/gif":return t.gif;case"image/heic":return t.heic;case"image/heif":return t.heif;case"image/webp":return t.webp;case"image/jpeg":default:return t.jpeg;case"image/png":return t.png;case"image/bmp":return t.bmp;case"image/avif":return t.avif}}formatToMimeType(e){switch(e){case t.gif:return"image/gif";case t.heic:return"image/heic";case t.heif:return"image/heif";case t.webp:return"image/webp";case t.jpeg:return"image/jpeg";case t.png:return"image/png";case t.bmp:return"image/bmp";case t.avif:return"image/avif";default:return"image/jpeg"}}process(t,o){return e(this,void 0,void 0,(function*(){var e,i,s,c,d;if(!window.Worker)throw new Error("Web Workers are not supported in this environment");if(!window.OffscreenCanvas)throw new Error("OffscreenCanvas is not supported in this environment");if(!this.supportedEncodeFormats.includes(o.format))throw new Error("Encoding to this format is not supported yet");const m=this.determineMimeType(t),p=this.mimeTypeToFormat(m);if(!t.type.startsWith("image")||!this.supportedDecodeFormats.includes(p))throw new Error("Decoding of this format is not supported yet");const u=n.createDecoder(p),g=yield u.decode(t),l=null!==(i=null===(e=o.resize)||void 0===e?void 0:e[0])&&void 0!==i?i:g.width,h=null!==(c=null===(s=o.resize)||void 0===s?void 0:s[1])&&void 0!==c?c:g.height,w=o.format,f=new r,b=yield f.compress({blob:g.blob,quality:null!==(d=o.quality)&&void 0!==d?d:100,targetWidth:l,targetHeight:h}),v=a.createEncoder(w),y=this.formatToMimeType(w);return(yield v.encode(b.blob,y)).blob}))}downloadFile(e,r){const t=URL.createObjectURL(e),o=document.createElement("a");o.href=t,o.download=r,document.body.appendChild(o),o.click(),URL.revokeObjectURL(t),document.body.removeChild(o)}}export{t as PictureFormat,c as PictureOperator};
