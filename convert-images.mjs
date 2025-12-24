import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const imgsDir = './com.kenscode.flightcategory.sdPlugin/imgs';

const conversions = [
  { src: 'plugin-icon.svg', dest: 'plugin-icon.png', size: 288 },
  { src: 'plugin-icon.svg', dest: 'plugin-icon@2x.png', size: 512 },
  { src: 'action-icon.svg', dest: 'action-icon.png', size: 20 },
  { src: 'action-icon.svg', dest: 'action-icon@2x.png', size: 40 },
  { src: 'vfr.svg', dest: 'vfr.png', size: 144 },
  { src: 'vfr.svg', dest: 'vfr@2x.png', size: 288 },
  { src: 'mvfr.svg', dest: 'mvfr.png', size: 144 },
  { src: 'mvfr.svg', dest: 'mvfr@2x.png', size: 288 },
  { src: 'ifr.svg', dest: 'ifr.png', size: 144 },
  { src: 'ifr.svg', dest: 'ifr@2x.png', size: 288 },
  { src: 'lifr.svg', dest: 'lifr.png', size: 144 },
  { src: 'lifr.svg', dest: 'lifr@2x.png', size: 288 },
];

async function convert() {
  for (const { src, dest, size } of conversions) {
    const svgPath = join(imgsDir, src);
    const pngPath = join(imgsDir, dest);

    try {
      const svgBuffer = readFileSync(svgPath);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      console.log(`Created ${dest}`);
    } catch (err) {
      console.error(`Error converting ${src}:`, err.message);
    }
  }
}

convert();
