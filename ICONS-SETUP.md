# PWA Icons Setup

The PWA requires icons in the `/icons/` directory with the following sizes:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Quick Icon Generation

You can generate all required icon sizes from a single 512x512 PNG using:

### Online Tools:
1. **PWA Icon Generator**: https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator**: https://realfavicongenerator.net/

### Using ImageMagick (Command Line):
```bash
# Install ImageMagick first
# Then run from your project directory:

convert your-logo-512.png -resize 72x72 icons/icon-72x72.png
convert your-logo-512.png -resize 96x96 icons/icon-96x96.png
convert your-logo-512.png -resize 128x128 icons/icon-128x128.png
convert your-logo-512.png -resize 144x144.png
convert your-logo-512.png -resize 152x152 icons/icon-152x152.png
convert your-logo-512.png -resize 192x192 icons/icon-192x192.png
convert your-logo-512.png -resize 384x384 icons/icon-384x384.png
cp your-logo-512.png icons/icon-512x512.png
```

### Using Node.js (pwa-asset-generator):
```bash
npm install -g pwa-asset-generator
pwa-asset-generator your-logo.png ./icons --icon-only
```

## Design Recommendations:

1. **Square Canvas**: 512x512px minimum
2. **Safe Zone**: Keep important content within 80% of the canvas
3. **Simple Design**: Works well at small sizes
4. **High Contrast**: Visible on both light and dark backgrounds
5. **Solid Background**: Avoid transparency for best results

## Hippocamp Logo Ideas:
- Hippo mascot with graduation cap
- "HC" monogram
- Network node visualization
- Brain + compute symbol

## Temporary Fallback:
Until you create icons, the app will use browser defaults. The PWA will still work, but won't have custom app icons on the home screen.
