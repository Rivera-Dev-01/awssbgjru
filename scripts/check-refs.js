const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname, "..", "frontend");
const exts = new Set([".html", ".css", ".js", ".json"]);

function walk(d) {
  const r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== "scratch") r.push(...walk(f));
    } else if (exts.has(path.extname(e.name))) {
      r.push(f);
    }
  }
  return r;
}

let found = 0;
for (const f of walk(dir)) {
  const c = fs.readFileSync(f, "utf8");
  const matches = c.match(/\.png["')\s`]/g);
  if (matches) {
    console.log(`${path.relative(dir, f)}: ${matches.length} match(es)`);
    found += matches.length;
  }
}
console.log(found > 0 ? `\n${found} remaining .png references found` : "\nNo remaining .png references!");
