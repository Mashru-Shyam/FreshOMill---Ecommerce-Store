# FreshOMill product image standards

## Source files

- Preferred format: WebP or high-quality JPEG for photographs; PNG only when transparency is necessary.
- Color space: sRGB.
- Recommended master size: 1600 × 1600 px or larger.
- Minimum useful size: 1000 × 1000 px.
- Preferred composition: square canvas, centered package or ingredient, consistent camera angle, and breathing room around the subject.
- Avoid embedded text, unsupported certification marks, watermarks, borders, and promotional badges.

## Aspect ratio and crop

- Primary product and gallery images use a square source ratio.
- The product stage uses `object-fit: cover` to match the reference composition.
- Keep important product details inside the central 80% safe area so responsive crops do not remove them.
- Related-product cards use a landscape display crop; the same central safe area rule applies.

## Responsive delivery

- Main gallery candidates: 480, 720, 960, 1200, and 1400 px.
- Thumbnail source width: 180 px; desktop display width: 82 px; compact display width: 66–68 px.
- Related-card candidates: 220, 360, 480, and 620 px.
- The first gallery image loads eagerly with high fetch priority; remaining gallery and related images load lazily.
- Shopify `image_url` and `image_tag` provide CDN resizing, intrinsic dimensions, and responsive `srcset` output.

## Zoom

- Zoom uses the 1400 px Shopify CDN rendition.
- Do not upscale a source smaller than the requested rendition.
- Product photography should remain legible at 200% browser zoom.

## Alt text

- Describe the visible product and relevant packaging or ingredient view.
- Keep text concise and useful; do not repeat “image of.”
- Do not insert keywords, prices, unsupported benefits, or decorative punctuation.
- Decorative supporting artwork should use empty alt text.
- If an uploaded image has no alt text, the theme falls back to the product title.

## Compression review

- Allow Shopify to select CDN output quality unless measured testing supports an explicit override.
- Remove unnecessary metadata before upload.
- Check for visible banding, halos, text artifacts, and excessive blur.
- Confirm the image remains sharp on high-density mobile screens without loading the master file unnecessarily.
