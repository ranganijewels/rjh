// Responsive sizes for uploaded images. The server keeps "<file>.w<W>.webp" copies
// beside every uploaded png/jpg/webp (make-image-variants.sh) and nginx falls back
// to the original when a size doesn't exist, so these candidates are always safe.
const WIDTHS = [160, 320, 480, 640, 960, 1280, 1920];
const UPLOAD = /^https?:\/\/(api\.ranganijewelry\.com|localhost:4000)\/uploads\/[^?#]+\.(png|jpe?g|webp)$/i;

export function uploadSrcSet(url, maxWidth = 1920) {
  if (!url || !UPLOAD.test(url)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${url}.w${w}.webp ${w}w`)
    .join(", ");
}

// Spread onto an <img>: {...responsiveImg(src, "(min-width:1024px) 25vw, 50vw")}
export function responsiveImg(url, sizes, maxWidth) {
  const srcSet = uploadSrcSet(url, maxWidth);
  return srcSet ? { srcSet, sizes } : {};
}
