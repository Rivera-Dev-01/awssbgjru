const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const assetsDir = path.resolve(__dirname, "..", "frontend", "assets");
const results = { converted: 0, skipped: 0, failed: 0 };

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.png$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function convert(file) {
  const out = file.replace(/\.png$/i, ".webp");
  if (fs.existsSync(out)) {
    results.skipped++;
    return;
  }
  try {
    await sharp(file).webp({ quality: 80, effort: 6 }).toFile(out);
    results.converted++;
    const orig = fs.statSync(file).size;
    const webp = fs.statSync(out).size;
    const saved = ((1 - webp / orig) * 100).toFixed(1);
    console.log(`✓ ${path.relative(assetsDir, file)}  (${saved}% saved)`);
  } catch (err) {
    results.failed++;
    console.error(`✗ ${path.relative(assetsDir, file)}  ${err.message}`);
  }
}

(async () => {
  console.log("Scanning for PNGs...");
  const files = walk(assetsDir);
  console.log(`Found ${files.length} PNGs\n`);
  for (const f of files) await convert(f);
  console.log(`\nDone. ${results.converted} converted, ${results.skipped} skipped, ${results.failed} failed`);
})();
