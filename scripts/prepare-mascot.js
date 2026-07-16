const path = require("node:path");
const sharp = require("sharp");

const assets = [
  ["/private/tmp/hima-rocket.png", "frontend/assets/about/mascot/hima-rocket.webp"],
  ["/private/tmp/hima-rocket-hug.png", "frontend/assets/about/mascot/hima-rocket-hug.webp"],
  ["/private/tmp/hima-rocket-point.png", "frontend/assets/about/mascot/hima-rocket-point.webp"],
  ["/private/tmp/hima-representing.png", "frontend/assets/members/Mascot/hima-representing.webp"],
];

async function prepareMascots() {
  for (const [inputPath, outputPath] of assets) {
    await sharp(inputPath)
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(path.resolve(outputPath));
  }
}

prepareMascots().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
