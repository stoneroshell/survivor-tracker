"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

const root = path.join(__dirname, "..");
const srcPath = path.join(root, "public", "images", "immunity-idol.svg");
const outPath = path.join(root, "public", "favicon-v1.ico");

async function main() {
  const input = fs.readFileSync(srcPath);
  const sharpSvg = (buf) => sharp(buf, { density: 256 });
  const [buf16, buf32] = await Promise.all([
    sharpSvg(input).resize(16, 16).png().toBuffer(),
    sharpSvg(input).resize(32, 32).png().toBuffer(),
  ]);
  const ico = await toIco([buf16, buf32]);
  fs.writeFileSync(outPath, ico);
  console.log("Wrote", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
