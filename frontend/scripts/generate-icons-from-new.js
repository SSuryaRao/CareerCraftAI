const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputImage = path.join(__dirname, '../public/icons/newIcon.png');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure input file exists
if (!fs.existsSync(inputImage)) {
  console.error('❌ Error: newIcon.png not found in public/icons/');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating PWA icons from newIcon.png...\n');
console.log(`📁 Input: ${inputImage}`);
console.log(`📂 Output: ${outputDir}\n`);

async function generateIcons() {
  try {
    // Get metadata from input image
    const metadata = await sharp(inputImage).metadata();
    console.log(`📏 Original image size: ${metadata.width}x${metadata.height}\n`);

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      try {
        await sharp(inputImage)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(outputPath);

        console.log(`✓ Generated: icon-${size}x${size}.png`);
      } catch (error) {
        console.error(`✗ Failed to generate icon-${size}x${size}.png:`, error.message);
      }
    }

    console.log('\n✅ All icons generated successfully!');
    console.log('\n📋 Generated icon sizes:');
    sizes.forEach(size => console.log(`  - ${size}x${size}px`));

    console.log('\n💡 Next steps:');
    console.log('  1. Check the generated icons in public/icons/');
    console.log('  2. Delete the old icon.svg if no longer needed');
    console.log('  3. Delete newIcon.png if you want to keep things clean');
    console.log('  4. Run: npm run build');
    console.log('  5. Deploy your app!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

generateIcons().catch(console.error);
