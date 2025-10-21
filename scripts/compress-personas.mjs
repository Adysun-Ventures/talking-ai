#!/usr/bin/env node
// Compress images in public/personas (jpg, jpeg, png) in-place keeping filenames
// Usage: node scripts/compress-personas.mjs

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'public', 'personas');
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function fmtBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!VALID_EXTS.has(ext)) return { skipped: true };

  const src = await fs.readFile(filePath);
  let out;
  if (ext === '.png') {
    // Palette + max compression; preserve alpha
    out = await sharp(src)
      .png({ compressionLevel: 9, palette: true, quality: 80 })
      .toBuffer();
  } else {
    // JPEG: mozjpeg + quality 76, progressive
    out = await sharp(src)
      .jpeg({ quality: 76, mozjpeg: true, progressive: true })
      .toBuffer();
  }

  if (out.length >= src.length) {
    return { saved: 0, before: src.length, after: out.length, keptOriginal: true };
  }

  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, out);
  await fs.rename(tmpPath, filePath);
  return { saved: src.length - out.length, before: src.length, after: out.length };
}

async function main() {
  try {
    await fs.access(TARGET_DIR);
  } catch {
    console.error(`Directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;
  let skipped = 0;

  for await (const file of walk(TARGET_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!VALID_EXTS.has(ext)) continue;

    const { size } = await fs.stat(file);
    totalBefore += size;
    const res = await compressFile(file);
    if (res.skipped) { skipped++; continue; }
    optimized++;
    totalAfter += res.after ?? size;
    const beforeStr = fmtBytes(res.before ?? size);
    const afterStr = fmtBytes(res.after ?? size);
    const deltaStr = fmtBytes(res.saved ?? 0);
    const pct = res.before ? (((res.before - res.after) / res.before) * 100).toFixed(1) : '0.0';
    console.log(`✔ ${path.relative(ROOT, file)}  ${beforeStr} → ${afterStr}  (saved ${deltaStr}, ${pct}%)`);
  }

  const totalSaved = totalBefore - totalAfter;
  console.log('\nSummary:');
  console.log(`  Optimized files: ${optimized}`);
  console.log(`  Total before: ${fmtBytes(totalBefore)}`);
  console.log(`  Total after:  ${fmtBytes(totalAfter || totalBefore)}`);
  console.log(`  Saved:        ${fmtBytes(totalSaved > 0 ? totalSaved : 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


