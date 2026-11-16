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

function parseExif(buffer) {
  const result = {};
  if (!buffer || buffer.length < 10) return result;

  const str = buffer.toString('binary');

  // Search for common EXIF tag patterns
  // ImageDescription (0x010E)
  const descMatch = str.match(/[\x00-\x1f]?([\x20-\x7e]{3,})\x00/);
  
  // Try to find readable strings
  const readable = [];
  let current = '';
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    if (byte >= 0x20 && byte <= 0x7e) {
      current += String.fromCharCode(byte);
    } else {
      if (current.length >= 3) readable.push(current);
      current = '';
    }
  }
  if (current.length >= 3) readable.push(current);

  result.readableStrings = readable;

  // Look for XPTitle, XPKeywords, XPComment (Windows extended EXIF)
  // These are stored in the XP0001, XP0002, XP0003 tags
  // Try to find Unicode strings
  const utf16Strings = [];
  for (let i = 0; i < buffer.length - 1; i += 2) {
    const char = buffer.toString('utf16le').charAt(i / 2);
    if (char >= '\x20' && char <= '\x7e') {
      // potential utf16 string
    }
  }

  return result;
}

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
      console.log('  DPI:', metadata.density);

      if (metadata.exif) {
        console.log('  EXIF buffer length:', metadata.exif.length);
        // Print hex dump of EXIF
        const hex = metadata.exif.toString('hex');
        console.log('  EXIF hex:', hex);
        
        const parsed = parseExif(metadata.exif);
        console.log('  EXIF readable strings:', JSON.stringify(parsed.readableStrings));

        // Also try to parse as TIFF/EXIF structure
        const exif = metadata.exif;
        // Check for TIFF header (II or MM)
        if (exif.length > 8) {
          const byteOrder = exif.toString('binary', 0, 2);
          console.log('  Byte order:', byteOrder === 'II' ? 'little-endian' : byteOrder === 'MM' ? 'big-endian' : 'unknown');
        }
      }
    } catch (err) {
      console.log('  ERROR:', err.message);
    }
  }
}

analyze().catch(console.error);