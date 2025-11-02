const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputIcon = path.join(__dirname, 'public', 'icons', 'icon5.png');
const outputDir = path.join(__dirname, 'public', 'icons');
const faviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

async function generateIcons() {
  console.log('Generating icons from icon5.png...');

  // Generate all PWA icon sizes
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputIcon)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(outputPath);
    console.log(`Generated ${size}x${size} icon`);
  }

  // Generate favicon.ico (32x32 and 16x16)
  // Note: .ico files need special handling, so we'll create a 32x32 PNG
  // and you can convert it online or use a tool
  const favicon32Path = path.join(outputDir, 'favicon-32x32.png');
  const favicon16Path = path.join(outputDir, 'favicon-16x16.png');

  await sharp(inputIcon)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(favicon32Path);
  console.log('Generated 32x32 favicon PNG');

  await sharp(inputIcon)
    .resize(16, 16, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(favicon16Path);
  console.log('Generated 16x16 favicon PNG');

  // For .ico conversion, we'll use the png-to-ico package if available
  // Otherwise, we'll just copy the 32x32 as a fallback
  try {
    const pngToIco = require('png-to-ico');
    const icoBuffer = await pngToIco([favicon16Path, favicon32Path]);
    fs.writeFileSync(faviconPath, icoBuffer);
    console.log('Generated favicon.ico with transparency');
  } catch (error) {
    console.log('png-to-ico not available, copying 32x32 PNG as fallback');
    await sharp(inputIcon)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(faviconPath.replace('.ico', '.png'));
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
