const fs = require("fs");
const path = require("path");

const frontendDir = path.resolve(__dirname, "..", "frontend");

const files = [
  "pages/landing-page.html",
  "pages/members.html",
  "pages/department.html",
  "components/footer.html",
  "data/members.json",
  "css/landing-page.css",
  "css/landing-page-desktop.css",
  "css/members.css",
  "css/waiting-approval.css",
  "css/register.css",
  "js/members.js",
].map(f => path.join(frontendDir, f));

let totalChanged = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`? ${path.relative(frontendDir, file)} (not found)`);
    continue;
  }
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Replace .png" → .webp" (HTML attributes, JS strings, JSON)
  content = content.replace(/\.png"/g, '.webp"');
  // Replace .png' → .webp' (CSS url(), JS strings)
  content = content.replace(/\.png'/g, ".webp'");
  // Replace .png) → .webp) (CSS url() without quotes)
  content = content.replace(/\.png\)/g, ".webp)");
  // Replace .png` → .webp` (JS template literals)
  content = content.replace(/\.png`/g, ".webp`");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    totalChanged++;
    console.log(`✓ ${path.relative(frontendDir, file)}`);
  } else {
    console.log(`- ${path.relative(frontendDir, file)} (no changes)`);
  }
}

console.log(`\nDone. ${totalChanged} files updated.`);
