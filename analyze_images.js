const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Ejaz\\Desktop\\Ejaz-frontend-dev\\assets\\images\\projects';
const files = [
  'pexels-silverkblack-36730599.jpg',
  'pexels-godisable-jacob-226636-1936848.jpg',
  'pexels-freestocks-285171.jpg',
  'pexels-denys-9327162.jpg',
  '1600w-lFPtW72bHY0.jpg',
  '1600w-bNzXnSwXH-g.jpg'
];

async function analyze() {
  for (const f of files) {
    const filePath = path.join(dir, f);
    console.log('\n' + '='.repeat(80));
    console.log('FILE:', f);
    console.log('='.repeat(80));

    try {
      const metadata = await sharp(filePath).metadata();

      console.log('  Dimensions:', metadata.width, 'x', metadata.height);
      console.log('  Format:', metadata.format);
      console.log('  Channels:', metadata.channels);
      console.log('  DPI:', metadata.density, 'dpi');
      console.log('  ColorSpace:', metadata.space);
      console.log('  HasAlpha:', metadata.hasAlpha);
      console.log('  Orientation:', metadata.orientation);

      // EXIF data
      if (metadata.exif) {
        console.log('  --- EXIF Buffer present (length:', metadata.exif.length, ') ---');
        try {
          const exifStr = metadata.exif.toString('binary');
          const asciiMatches = exifStr.match(/[\x20-\x7e]{4,}/g);
          if (asciiMatches) {
            console.log('  EXIF text strings:', JSON.stringify(asciiMatches, null, 2));
          }
        } catch (e) {
          console.log('  EXIF parse error:', e.message);
        }
      } else {
        console.log('  EXIF: None found');
      }

      // ICC profile
      if (metadata.icc) {
        console.log('  ICC Profile: present (length:', metadata.icc.length, ')');
      }

      // Try to get more detailed metadata via image info
      const fullInfo = await sharp(filePath).toBuffer({ resolveWithObject: true });
      console.log('  File size (buffer):', fullInfo.info.size, 'bytes');

    } catch (err) {
      console.log('  ERROR:', err.message);
    }
  }
}

analyze().catch(console.error);